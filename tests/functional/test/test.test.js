import Transform from "../../../sources/index.js";
import CONSTANTS from "../../../sources/core/constants.js";

describe("Test (to, interface) - test (identity)", () => {
  /*
    Using "test" interface on "test" identity.
    "test" identity defines a "metrics" kind and a "json" lang. This is the
    configuration to be tested.

    This configuration defines several operations: one for $_('foo') and one for
    $_('bar'):
    - foo is applied an uppercase mutation ;
    - bar is applied a chaining mutation of uppercase and as_string.
  */
  test("complete transformation", async () => {
    const src = {
      test_metrics: {
        foo: "foo",
        bar: "bar"
      }
    };

    const expected = {
      foo: "FOO",
      bar: "BAR"
    };

    const p = await new Transform(
      src,
      CONSTANTS.ID.TEST,
      CONSTANTS.TO.TEST,
      CONSTANTS.KIND_METRICS
    );
    expect(p.format()).toEqual(expected);
  });
});
