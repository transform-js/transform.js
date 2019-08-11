import {
  TemplatesError,
  InterfaceError,
  FormatterError
} from "../../sources/core/errors.js";

describe("Errors", () => {
  test("TemplatesError", () => {
    const t = () => {
      throw new TemplatesError();
    };
    expect(t).toThrow(TemplatesError);
  });

  test("InterfaceError", () => {
    const t = () => {
      throw new InterfaceError();
    };
    expect(t).toThrow(InterfaceError);
  });

  test("FormatterError", () => {
    const t = () => {
      throw new FormatterError();
    };
    expect(t).toThrow(FormatterError);
  });
});
