const counterRadix = 36;

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

export class HybridLogicalClock {
  readonly #milliseconds: number;
  readonly #counter: number;
  readonly #deviceId: string;

  constructor(milliseconds: number, counter: number, deviceId: string) {
    this.#milliseconds = milliseconds;
    this.#counter = counter;
    this.#deviceId = deviceId;
  }

  valueOf(): string {
    const physicalTime = new Date(this.#milliseconds).toISOString();
    const counter = this.#counter.toString(counterRadix).padStart(5, "0");

    return `${physicalTime}-${counter}-${this.#deviceId}`;
  }

  send(systemTime: number): HybridLogicalClock {
    if (systemTime > this.#milliseconds) {
      return new HybridLogicalClock(systemTime, 0, this.#deviceId);
    }

    return new HybridLogicalClock(this.#milliseconds, this.#counter + 1, this.#deviceId);
  }

  receive(remote: HybridLogicalClock, systemTime: number): HybridLogicalClock {
    if (systemTime > this.#milliseconds && systemTime > remote.#milliseconds) {
      return new HybridLogicalClock(systemTime, 0, this.#deviceId);
    }

    if (this.#milliseconds === remote.#milliseconds) {
      return new HybridLogicalClock(this.#milliseconds, Math.max(this.#counter, remote.#counter) + 1, this.#deviceId);
    }

    if (this.#milliseconds > remote.#milliseconds) {
      return new HybridLogicalClock(this.#milliseconds, this.#counter + 1, this.#deviceId);
    }

    return new HybridLogicalClock(remote.#milliseconds, remote.#counter + 1, this.#deviceId);
  }

  static parse(value: string): HybridLogicalClock {
    if (value.length !== 67) {
      throw new ParseError("Invalid hybrid logical clock length");
    }

    const time = value.slice(0, 24);
    const counterString = value.slice(25, 30);
    const deviceId = value.slice(31, 67);

    const milliseconds = Date.parse(time);
    if (Number.isNaN(milliseconds)) {
      throw new ParseError("Invalid hybrid logical clock time");
    }

    const counter = parseInt(counterString, counterRadix);
    if (Number.isNaN(counter)) {
      throw new ParseError("Invalid hybrid logical clock counter");
    }

    return new HybridLogicalClock(milliseconds, counter, deviceId);
  }
}
