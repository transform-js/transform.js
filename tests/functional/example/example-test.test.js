import Transform from "../../../sources/index.js";
import CONSTANTS from "../../../sources/core/constants.js";
import Iexample from "../../../sources/interfaces/example/Iexample.js"

const src = {
  test_metrics: {
    foo: "foo",
    bar: "bar"
  }
};

describe("Example (to, interface) - test (identity)", () => {
  /*
    Using "example" interface on "test" identity.
    "test" identity defines a "metrics" kind and a "json" lang. This is the
    configuration to be tested.

    This configuration defines several operations: one for $_('foo') and one for
    $_('bar'):
    - foo is applied an uppercase mutation ;
    - bar is applied a chaining mutation of uppercase and as_string.
  */
  it("transforms data", async () => {
    const expected = {
      foo: "FOO",
      bar: "BAR"
    };

    const p = new Transform();
    expect(await p.format(
      src,
      CONSTANTS.ID.TEST,
      CONSTANTS.TO.EXAMPLE,
      CONSTANTS.KIND_METRICS
    )).toEqual(expected);
  });

  it("can post/pre process", async () => {
    const p = new Transform();
    expect(await p.call(Iexample, "callee", 42)).toEqual(42);
  });
});
