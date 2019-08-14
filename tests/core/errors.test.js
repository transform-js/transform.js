import {
  TemplatesError,
  InterfaceError,
  FormatterError,
  MutationError
} from "../../sources/core/errors.js";

describe("Errors", () => {
  test("TemplatesError", () => {
    const t = () => {
      throw new TemplatesError();
    };
    expect(t).toThrow(TemplatesError);
    expect(t).toThrow(Error);
  });

  test("InterfaceError", () => {
    const t = () => {
      throw new InterfaceError();
    };
    expect(t).toThrow(InterfaceError);
    expect(t).toThrow(Error);
  });

  test("FormatterError", () => {
    const t = () => {
      throw new FormatterError();
    };
    expect(t).toThrow(FormatterError);
    expect(t).toThrow(Error);
  });

  test("MutationError", () => {
    const t = () => {
      throw new MutationError();
    };
    expect(t).toThrow(MutationError);
    expect(t).toThrow(Error);
  });
});
