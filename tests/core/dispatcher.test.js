import { resolve } from "path";
import CONSTANTS from "../../sources/core/constants.js";
import Transform from '../../sources/index.js'
import Iexample from '../../sources/interfaces/example/Iexample.js'
import { DispatcherError } from "../../sources/core/errors.js";


describe("Transform dispatcher", () => {
  it("creates an instance", () => {
    const i = new Transform();
    expect(i).not.toBeNull();
    expect(i).toBeInstanceOf(Transform);
  });

  it("can add interface using relative path", () => {
    const t = new Transform();
    t.addInterface(
      "test_import",
      resolve("sources/interfaces/example/Iexample.js")
    );
    const src = {
      test_metrics: {
        foo: "foo",
        bar: "bar"
      }
    };
    t.format(src, CONSTANTS.ID.TEST, "test_import", CONSTANTS.KIND_METRICS);
  });

  it("cannot import invalid interface", async () => {
    await expect(
      new Transform().format("src", "id", "INVALID_INTERFACE", "kind")
    ).rejects.toThrow(Error);
  });

  it('cannot import invalid interface', async () => {
    await expect(
      new Transform().format('src', 'id', 'INVALID_INTERFACE', 'kind')
    ).rejects.toThrow(DispatcherError)
  })

  it('can not post/pre process on unknow function', async () => {
    await expect(
      new Transform().call(Iexample, 'nonExistingFunction', 42)
    ).rejects.toThrow(DispatcherError)
  })

  it('can not post/pre process on unknow interface', async () => {
    await expect(new Transform().call(null, '', 42)).rejects.toThrow(DispatcherError)
  })
})