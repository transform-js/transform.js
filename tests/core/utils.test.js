import {
  jsonGetByPath,
  jsonSetbyPath,
  jsonRemoveKeysContaining,
  cleanObject
} from "../../sources/core/utils.js";
import CONSTANTS from "../../sources/core/constants.js";

describe("jsonGetByPath", () => {
  test("simple, depth = 0", () => {
    const j = { foo: "bar" };
    expect(jsonGetByPath(j, "foo")).toStrictEqual("bar");
  });

  test("nested, depth = 1", () => {
    const j = { foo: { foo: "bar" } };
    expect(jsonGetByPath(j, "foo.foo")).toStrictEqual("bar");
  });
});

describe("jsonSetbyPath", () => {
  test("simple, depth = 0", () => {
    let j = { foo: "bar" };
    const e = { foo: "baz" };
    jsonSetbyPath(j, "baz", "foo");
    expect(j).toStrictEqual(e);
  });

  test("nested, depth = 1", () => {
    let j = { foo: { foo: "bar" } };
    const e = { foo: { foo: "baz" } };
    jsonSetbyPath(j, "baz", "foo.foo");
    expect(j).toStrictEqual(e);
  });

  test("create new path, depth = 0", () => {
    let j = { foo: "foo" };
    const e = { foo: "foo", bar: "bar" };
    jsonSetbyPath(j, "bar", "bar");
    expect(j).toStrictEqual(e);
  });

  test("create new path, depth = 1", () => {
    let j = { foo: "foo" };
    const e = { foo: "foo", bar: { bar: "bar" } };
    jsonSetbyPath(j, "bar", "bar.bar");
    expect(j).toStrictEqual(e);
  });
});

describe("jsonRemoveKeysContaining", () => {
  test("complete", () => {
    let j = {
      foo: CONSTANTS.MAGIC
    };
    jsonRemoveKeysContaining(j, CONSTANTS.MAGIC);
    expect(j).toStrictEqual({});
  });
});

describe("cleanObject", () => {
  test("complete", () => {
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
    const e = { foo: "bar", waldo: { foo: "bar" } };
    expect(cleanObject(o)).toStrictEqual(e);
  });
});
