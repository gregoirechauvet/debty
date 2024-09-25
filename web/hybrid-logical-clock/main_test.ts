import { assertEquals, assertThrows } from "jsr:@std/assert";
import { HybridLogicalClock, ParseError } from "./main.ts";

Deno.test(function valueOf() {
  const milliseconds = 981173106007;
  const counter = 47;
  const deviceId = "33d5acc3-212c-461a-89df-d0d0e4bb5417";

  const clock = new HybridLogicalClock(milliseconds, counter, deviceId);
  assertEquals(clock.valueOf(), "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417");
});

Deno.test("parse", async (t) => {
  await t.step("Valid clock", () => {
    const value = "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417";

    const clock = HybridLogicalClock.parse(value);
    assertEquals(clock.valueOf(), "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417");
  });

  await t.step("Invalid length", () => {
    const value = "2001-02-03T04:05:06.007Z-0001b-invalid";
    assertThrows(() => HybridLogicalClock.parse(value), ParseError, "Invalid hybrid logical clock length");
  });

  await t.step("Invalid time", () => {
    const value = "2001-02-03T34:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417";
    assertThrows(() => HybridLogicalClock.parse(value), ParseError, "Invalid hybrid logical clock time");
  });

  await t.step("Invalid counter", () => {
    const value = "2001-02-03T04:05:06.007Z-!aaaa-33d5acc3-212c-461a-89df-d0d0e4bb5417";
    assertThrows(() => HybridLogicalClock.parse(value), ParseError, "Invalid hybrid logical clock counter");
  });
});

Deno.test("send", async (t) => {
  await t.step("System time is ahead of clock", () => {
    const value = "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417";
    const clock = HybridLogicalClock.parse(value);

    const systemTime = Date.parse("2001-02-04T00:00:00.000Z");
    const actual = clock.send(systemTime);

    assertEquals(actual.valueOf(), "2001-02-04T00:00:00.000Z-00000-33d5acc3-212c-461a-89df-d0d0e4bb5417");
  });

  await t.step("System time is behind latest clock time", () => {
    const value = "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417";
    const clock = HybridLogicalClock.parse(value);

    const systemTime = Date.parse("2001-02-03T00:00:00.000Z");
    const actual = clock.send(systemTime);

    assertEquals(actual.valueOf(), "2001-02-03T04:05:06.007Z-0001c-33d5acc3-212c-461a-89df-d0d0e4bb5417");
  });
});

Deno.test("receive", async (t) => {
  await t.step("System time is ahead", () => {
    const currentClock = HybridLogicalClock.parse(
      "2001-02-03T04:05:06.007Z-00003-33d5acc3-212c-461a-89df-d0d0e4bb5417",
    );
    const remoteClock = HybridLogicalClock.parse("2001-02-03T04:05:07.000Z-00004-374b359b-66b2-4cb8-9d34-dc132440e249");
    const systemTime = Date.parse("2001-02-04T00:00:00.000Z");

    const actual = currentClock.receive(remoteClock, systemTime);

    assertEquals(actual.valueOf(), "2001-02-04T00:00:00.000Z-00000-33d5acc3-212c-461a-89df-d0d0e4bb5417");
  });

  await t.step("Remote clock is ahead", () => {
    const currentClock = HybridLogicalClock.parse(
      "2001-02-03T04:05:06.007Z-00003-33d5acc3-212c-461a-89df-d0d0e4bb5417",
    );
    const remoteClock = HybridLogicalClock.parse("2001-02-03T04:05:07.000Z-00004-374b359b-66b2-4cb8-9d34-dc132440e249");
    const systemTime = Date.parse("2001-02-03T04:05:06.500Z");

    const actual = currentClock.receive(remoteClock, systemTime);

    assertEquals(actual.valueOf(), "2001-02-03T04:05:07.000Z-00005-33d5acc3-212c-461a-89df-d0d0e4bb5417");
  });

  await t.step("Current clock is ahead", () => {
    const currentClock = HybridLogicalClock.parse(
      "2001-02-03T04:05:06.007Z-00004-33d5acc3-212c-461a-89df-d0d0e4bb5417",
    );
    const remoteClock = HybridLogicalClock.parse("2001-02-03T04:00:00.000Z-00006-374b359b-66b2-4cb8-9d34-dc132440e249");
    const systemTime = Date.parse("2001-02-03T00:00:00.000Z");

    const actual = currentClock.receive(remoteClock, systemTime);

    assertEquals(actual.valueOf(), "2001-02-03T04:05:06.007Z-00005-33d5acc3-212c-461a-89df-d0d0e4bb5417");
  });

  await t.step("All clocks are equal", () => {
    const currentClock = HybridLogicalClock.parse(
      "2001-02-03T04:05:06.007Z-00007-33d5acc3-212c-461a-89df-d0d0e4bb5417",
    );
    const remoteClock = HybridLogicalClock.parse("2001-02-03T04:05:06.007Z-00003-374b359b-66b2-4cb8-9d34-dc132440e249");
    const systemTime = Date.parse("2001-02-03T04:05:06.007Z");

    const actual = currentClock.receive(remoteClock, systemTime);

    assertEquals(actual.valueOf(), "2001-02-03T04:05:06.007Z-00008-33d5acc3-212c-461a-89df-d0d0e4bb5417");
  });
});
