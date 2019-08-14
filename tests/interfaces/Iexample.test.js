import Iexample from "../../sources/interfaces/example/Iexample.js";
import CONSTANTS from "../../sources/core/constants.js";

describe("Iexample", () => {
  /*
    No mutation is defined for moo, hence, moo will not be kept. (see m_any mutation).
    baz is not existing as a placeholder ( $_('baz') ) in the template. It won't be
    kept either.
    Uppercase and uppercase + as_string applies to foo and bar keys in accordance
    with the configuration ('example' interface, 'test' identity, 'metrics' kind, 'json' lang)
  */
  test("Basic transformation", () => {
    const src = {
      test_metrics: {
        foo: "abc",
        bar: "def",
        baz: "hij"
      }
    };

    const expected = {
      foo: "ABC",
      bar: "DEF"
    };

    const dst = new Iexample(
      src,
      CONSTANTS.ID.TEST,
      CONSTANTS.KIND_METRICS,
      CONSTANTS.LANG_JSON
    ).get();
    expect(dst).toEqual(expected);
  });
});
