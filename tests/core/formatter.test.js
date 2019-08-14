import Formatter from "../../sources/core/formatter.js";
import { m_uppercase } from "../../sources/core/mutations.js";
import { FormatterError } from "../../sources/core/errors.js";

const src = {
  foo: "bar"
};

const operations = [
  {
    from: "foo",
    to: "bar",
    mutations: m_uppercase
  }
];

const template = '{ "foo": "${_("bar")}" }';

const f = new Formatter(src, operations, template);

describe("formatter", () => {
  it("is passing", () => {
    const e = { foo: "BAR" };
    expect(f.format()).toStrictEqual(e);
  });

  it("filters lang", () => {
    expect(() => f.format("unexpected lang")).toThrow(FormatterError);
  });
});
