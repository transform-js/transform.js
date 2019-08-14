import * as m from "../../sources/core/mutations.js";
import { MutationError } from "../../sources/core/errors.js";

const _ = {}; /* mock dst */

describe("is number", () => {
  it("is not passing", () => {
    expect(m.m_is_number(_, "")).toBeFalsy();
    expect(m.m_is_number(_, "string")).toBeFalsy();
  });

  it("is passing", () => {
    expect(m.m_is_number(_, 0)).toBeTruthy();
    expect(m.m_is_number(_, 0.42)).toBeTruthy();
    expect(m.m_is_number(_, 0x42)).toBeTruthy();
    expect(m.m_is_number(_, 0b11)).toBeTruthy();
    expect(m.m_is_number(_, 0o11)).toBeTruthy();
    expect(m.m_is_number(_, 42e1)).toBeTruthy();

    expect(m.m_is_number(_, NaN)).toBeTruthy();
    expect(m.m_is_number(_, Infinity)).toBeTruthy();
  });
});

describe("any", () => {
  it("is not passing", () => {});

  it("is passing", () => {
    const j = { foo: "bar" };
    expect(m.m_any(_, j)).toBe(j);
  });
});

describe("stringify", () => {
  it("is not passing", () => {});

  it("is passing", () => {
    const j = { foo: "bar" };
    const e = '{"foo":"bar"}';
    expect(m.m_stringify(_, j)).toBe(e);
  });
});

describe("as string", () => {
  it("is not passing", () => {
    expect(() => m.m_as_string(_, {})).toThrow(MutationError);
    expect(() => m.m_as_string(_, null)).toThrow(MutationError);
    expect(() => m.m_as_string(_, undefined)).toThrow(MutationError);
    expect(() => m.m_as_string(_, [])).toThrow(MutationError);
    expect(() => m.m_as_string(_, NaN)).toThrow(MutationError);
  });

  it("is passing", () => {
    expect(m.m_as_string(_, "foo")).toBe('"foo"');
    expect(m.m_as_string(_, "42")).toBe('"42"');
    expect(m.m_as_string(_, 42)).toBe('"42"');
    expect(m.m_as_string(_, 0x42, 16)).toBe('"0x42"');
  });
});

describe("uppercase", () => {
  it("is not passing", () => {
    expect(() => m.m_uppercase(_, 42)).toThrow(MutationError);
    expect(() => m.m_uppercase(_, undefined)).toThrow(MutationError);
    expect(() => m.m_uppercase(_, null)).toThrow(MutationError);
    expect(() => m.m_uppercase(_, {})).toThrow(MutationError);
    expect(() => m.m_uppercase(_, [])).toThrow(MutationError);
  });

  it("is passing", () => {
    expect(m.m_uppercase(_, "foo")).toBe("FOO");
    expect(m.m_uppercase(_, "FOO")).toBe("FOO");
  });
});

describe("chain", () => {
  it("is not passing", () => {
    expect(() => m.m_chain({}, null, [m.m_uppercase, m.m_as_string])).toThrow(
      MutationError
    );
  });

  it("is passing", () => {
    const dst = { foo: "bar" };
    expect(m.m_chain(dst, dst.foo, [m.m_uppercase, m.m_as_string])).toBe(
      '"BAR"'
    );
  });
});
