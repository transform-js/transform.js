import Imother from "../Imother.js";
import Formatter from "../../core/formatter.js";
import { InterfaceError } from "../../core/errors.js";
import CONFIG from "./config.js";

class Itest extends Imother {
  constructor(src, id, kind, lang) {
    super();
    try {
      const template = CONFIG[id][kind][lang].tpl;
      const operations = CONFIG[id][kind][lang].operations;

      this.dst = new Formatter(src, operations, template).format();
    } catch (e) {
      throw new InterfaceError(e.message);
    }
  }
}

export default Itest;
