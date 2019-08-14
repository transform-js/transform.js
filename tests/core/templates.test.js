import Templates from "../../sources/core/templates.js";
import { TemplatesError } from "../../sources/core/errors.js";

describe("templates", () => {
  it("requires a template string", () => {
    expect(() => new Templates()).toThrow(TemplatesError);
  });

  it("fills Json template", () => {
    // config template
    const template = '{ "foo": "${_("bar")}" }';
    // template manager
    const t = new Templates(template);
    // prepared template
    const prepared = t.prepare(/*template*/);
    expect(prepared).toStrictEqual('{ "foo": "${bar}" }');
    // template keys, placeholders
    const keys = t.getTemplateVars();
    expect(keys).toStrictEqual(["bar"]);
    // template values
    const dst = { bar: "BAR" };
    // expected JSON
    const e = { foo: "BAR" };
    expect(t.jsonFill(prepared, keys, dst)).toStrictEqual(e);
  });

  it("throws on bad json parsing (e.g. poorly written template)", () => {
    // mismatching quotes in template around 'bar' guards
    const badTemplate = '{ "foo": "${_("bar")} }';
    const t = new Templates(badTemplate);
    const prepared = t.prepare(badTemplate);
    expect(prepared).toStrictEqual('{ "foo": "${bar} }');
    const keys = t.getTemplateVars();
    expect(keys).toStrictEqual(["bar"]);

    const dst = { bar: "BAR" };
    const e = { foo: "BAR" };

    expect(() => t.jsonFill(prepared, keys, dst)).toThrow(TemplatesError);
  });
});
