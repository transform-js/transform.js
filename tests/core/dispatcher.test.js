import Transform from "../../sources/index.js";
import Iexample from "../../sources/interfaces/example/Iexample.js"

describe('Transform dispatcher', () => {
  it('creates an instance', () => {
    const i = new Transform()
    expect(i).not.toBeNull()
    expect(i).toBeInstanceOf(Transform)
  })

  it('can not post/pre process on unknow function', async () => {
    await expect(new Transform().call(Iexample, "nonExistingFunction", 42)).rejects.toThrow(Error);
  });

  it('can not post/pre process on unknow interface', async () => {
    await expect(new Transform().call(null, "", 42)).rejects.toThrow(Error);
  });
})
