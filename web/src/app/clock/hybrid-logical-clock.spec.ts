import { HybridLogicalClock, ParseError } from "./hybrid-logical-clock";

describe("HybridLogicalClock", () => {
  describe("valueOf", () => {
    it("should return a stringified representation", () => {
      const milliseconds = 981173106007;
      const counter = 47;
      const deviceId = "33d5acc3-212c-461a-89df-d0d0e4bb5417";

      const clock = new HybridLogicalClock(milliseconds, counter, deviceId);
      expect(clock.valueOf()).toBe("2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417");
    });
  });

  describe("parse", () => {
    it("should parse a valid clock", () => {
      const value = "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417";

      const clock = HybridLogicalClock.parse(value);
      expect(clock.valueOf()).toBe("2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417");
    });

    it("should throw on invalid clock length", () => {
      const value = "2001-02-03T04:05:06.007Z-0001b-invalid";
      expect(() => HybridLogicalClock.parse(value)).toThrow(new ParseError("Invalid hybrid logical clock length"));
    });

    it("should throw on invalid clock time", () => {
      const value = "2001-02-03T34:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417";
      expect(() => HybridLogicalClock.parse(value)).toThrow(new ParseError("Invalid hybrid logical clock time"));
    });

    it("should throw on invalid clock counter", () => {
      const value = "2001-02-03T04:05:06.007Z-!aaaa-33d5acc3-212c-461a-89df-d0d0e4bb5417";
      expect(() => HybridLogicalClock.parse(value)).toThrow(new ParseError("Invalid hybrid logical clock counter"));
    });
  });

  describe("send", () => {
    it("should use system time when ahead of clock", () => {
      const value = "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417";
      const clock = HybridLogicalClock.parse(value);

      const systemTime = Date.parse("2001-02-04T00:00:00.000Z");
      const actual = clock.send(systemTime);

      expect(actual.valueOf()).toBe("2001-02-04T00:00:00.000Z-00000-33d5acc3-212c-461a-89df-d0d0e4bb5417");
    });

    it("should ignore system time when behind clock", () => {
      const value = "2001-02-03T04:05:06.007Z-0001b-33d5acc3-212c-461a-89df-d0d0e4bb5417";
      const clock = HybridLogicalClock.parse(value);

      const systemTime = Date.parse("2001-02-03T00:00:00.000Z");
      const actual = clock.send(systemTime);

      expect(actual.valueOf()).toBe("2001-02-03T04:05:06.007Z-0001c-33d5acc3-212c-461a-89df-d0d0e4bb5417");
    });
  });

  describe("receive", () => {
    it("should use system time when ahead", () => {
      const currentClock = HybridLogicalClock.parse(
        "2001-02-03T04:05:06.007Z-00003-33d5acc3-212c-461a-89df-d0d0e4bb5417",
      );
      const remoteClock = HybridLogicalClock.parse(
        "2001-02-03T04:05:07.000Z-00004-374b359b-66b2-4cb8-9d34-dc132440e249",
      );
      const systemTime = Date.parse("2001-02-04T00:00:00.000Z");

      const actual = currentClock.receive(remoteClock, systemTime);

      expect(actual.valueOf()).toBe("2001-02-04T00:00:00.000Z-00000-33d5acc3-212c-461a-89df-d0d0e4bb5417");
    });

    it("should use remote clock when ahead", () => {
      const currentClock = HybridLogicalClock.parse(
        "2001-02-03T04:05:06.007Z-00003-33d5acc3-212c-461a-89df-d0d0e4bb5417",
      );
      const remoteClock = HybridLogicalClock.parse(
        "2001-02-03T04:05:07.000Z-00004-374b359b-66b2-4cb8-9d34-dc132440e249",
      );
      const systemTime = Date.parse("2001-02-03T04:05:06.500Z");

      const actual = currentClock.receive(remoteClock, systemTime);

      expect(actual.valueOf()).toBe("2001-02-03T04:05:07.000Z-00005-33d5acc3-212c-461a-89df-d0d0e4bb5417");
    });

    it("should use current clock when ahead", () => {
      const currentClock = HybridLogicalClock.parse(
        "2001-02-03T04:05:06.007Z-00004-33d5acc3-212c-461a-89df-d0d0e4bb5417",
      );
      const remoteClock = HybridLogicalClock.parse(
        "2001-02-03T04:00:00.000Z-00006-374b359b-66b2-4cb8-9d34-dc132440e249",
      );
      const systemTime = Date.parse("2001-02-03T00:00:00.000Z");

      const actual = currentClock.receive(remoteClock, systemTime);

      expect(actual.valueOf()).toBe("2001-02-03T04:05:06.007Z-00005-33d5acc3-212c-461a-89df-d0d0e4bb5417");
    });

    it("should increment greatest counter when all clocks are equal", () => {
      const currentClock = HybridLogicalClock.parse(
        "2001-02-03T04:05:06.007Z-00007-33d5acc3-212c-461a-89df-d0d0e4bb5417",
      );
      const remoteClock = HybridLogicalClock.parse(
        "2001-02-03T04:05:06.007Z-00003-374b359b-66b2-4cb8-9d34-dc132440e249",
      );
      const systemTime = Date.parse("2001-02-03T04:05:06.007Z");

      const actual = currentClock.receive(remoteClock, systemTime);

      expect(actual.valueOf()).toBe("2001-02-03T04:05:06.007Z-00008-33d5acc3-212c-461a-89df-d0d0e4bb5417");
    });
  });
});
