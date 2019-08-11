import CONSTANTS from "./constants.js";
import { InterfaceError } from "./errors.js";

class Dispatcher {
  /*
    src: source data (the raw data to be transformed)
    id: identity (Your configuration entrypoint. See 'test')
    to: interface (your plugin code where you can pre/post process. See 'test')
    kind: kind of data (e.g. metrics, errors)
    lang: template format (e.g. json, xml, custom)
  */
  constructor(src, id, to, kind, lang = CONSTANTS.LANG_JSON) {
    return new Promise(async (resolve, reject) => {
      try {
        import("../interfaces/" + to + "/I" + to + ".js").then(I => {
          this.I = new I.default(src, id.toLowerCase(), kind, lang);
        });
      } catch (ex) {
        return reject(ex);
      }
      resolve(this);
    });
  }

  /*
    Your interface must return the transformed data in a 'dst' variable
  */
  format() {
    return this.I.get();
  }

  /*
    This 'call' function takes an interface function name and its arguments.
    You can use it to reach some interface static code out of the transformation
    process. For example, you wan't to decide which 'kind' to use (e.g. metrics
    or errors) based on some external data (e.g. an http status code).
  */
  call(fn, ...args) {
    try {
      return this.I[fn](...args);
    } catch (e) {
      throw new InterfaceError("Function not found for that interface");
    }
  }
}

export default Dispatcher;
