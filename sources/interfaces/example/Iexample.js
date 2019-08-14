import Imother from "../Imother.js";
import Formatter from "../../core/formatter.js";
import { InterfaceError } from "../../core/errors.js";
import CONFIG from "./config.js";

class Iexample extends Imother {
  constructor(src, id, kind, lang) {
    super();
    this.src = src;
    this.id = id;
    this.kind = kind;
    this.lang = lang;
  }

  get() {
    try {
      const template = CONFIG[this.id][this.kind][this.lang].tpl;
      const operations = CONFIG[this.id][this.kind][this.lang].operations;

      return new Formatter(this.src, operations, template).format();
    } catch (e) {
      throw new InterfaceError(e.message);
    }
  }

  callee(whatever) {
    return whatever;
  }
}

export default Iexample;
