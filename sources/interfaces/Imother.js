import { InterfaceError } from "../core/errors.js";

class Imother {
  get() {
    if (this.dst) return this.dst;
    throw new InterfaceError("dst variable is not set in interface");
  }
}

export default Imother;
