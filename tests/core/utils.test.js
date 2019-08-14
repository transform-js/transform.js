import {
  jsonGetByPath,
  jsonSetbyPath,
  jsonRemoveKeysContaining,
  cleanObject
} from "../../sources/core/utils.js";
import CONSTANTS from "../../sources/core/constants.js";

describe("jsonGetByPath", () => {
  it("simple, depth = 0", () => {
    const j = { foo: "bar" };
    expect(jsonGetByPath(j, "foo")).toStrictEqual("bar");
  });

  it("nested, depth = 1", () => {
    const j = { foo: { foo: "bar" } };
    expect(jsonGetByPath(j, "foo.foo")).toStrictEqual("bar");
  });
});

describe("jsonSetbyPath", () => {
  it("simple, depth = 0", () => {
    let j = { foo: "bar" };
    const e = { foo: "baz" };
    jsonSetbyPath(j, "baz", "foo");
    expect(j).toStrictEqual(e);
  });

  it("nested, depth = 1", () => {
    let j = { foo: { foo: "bar" } };
    const e = { foo: { foo: "baz" } };
    jsonSetbyPath(j, "baz", "foo.foo");
    expect(j).toStrictEqual(e);
  });

  it("create new path, depth = 0", () => {
    let j = { foo: "foo" };
    const e = { foo: "foo", bar: "bar" };
    jsonSetbyPath(j, "bar", "bar");
    expect(j).toStrictEqual(e);
  });

  it("create new path, depth = 1", () => {
    let j = { foo: "foo" };
    const e = { foo: "foo", bar: { bar: "bar" } };
    jsonSetbyPath(j, "bar", "bar.bar");
    expect(j).toStrictEqual(e);
  });
});

describe("jsonRemoveKeysContaining", () => {
  it("simple, depth = 0", () => {
    let j = {
      foo: CONSTANTS.MAGIC
    };
    jsonRemoveKeysContaining(j, CONSTANTS.MAGIC);
    expect(j).toStrictEqual({});
  });

  it("nested, depth = 1", () => {
    let j = {
      foo: CONSTANTS.MAGIC,
      bar: {
        foo: ["foo", CONSTANTS.MAGIC],
        bar: {},
        baz: CONSTANTS.MAGIC
      },
      baz: "baz"
    };
    const e = {
      bar: {
        foo: ["foo"],
        bar: {}
      },
      baz: "baz"
    };
    jsonRemoveKeysContaining(j, CONSTANTS.MAGIC);
    expect(j).toStrictEqual(e);
  });
});

describe("cleanObject", () => {
  it("complete", () => {
    let o = {
      foo: "bar",
      bar: "",
      baz: null,
      qux: {},
      quux: [],
      corge: undefined,
      grault: new Object(),
      garply: new Array(),
      waldo: {
        foo: "bar",
        bar: "",
        baz: []
      }
    };
    const e = {
      foo: "bar",
      waldo: { foo: "bar" }
    };
    expect(cleanObject(o)).toStrictEqual(e);
  });
});
