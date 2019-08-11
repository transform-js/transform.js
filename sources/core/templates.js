import CONSTANTS from "./constants.js";
import { TemplatesError } from "./errors.js";
import {
  jsonGetByPath,
  jsonSetbyPath,
  jsonRemoveKeysContaining
} from "./utils.js";

export default (ts => {
  let _keys = [];
  let _template;
  let _prepared;

  const _ = key => {
    /* keep track of template keys */
    _keys = [..._keys, key];
    /* inject new var in template */
    return "${" + key + "}";
  };

  const evalTemplateString = s => {
    /* eval template string, will hopefully call the underscore (_) function */
    _prepared = eval("`" + s + "`"); // XSS
    return _prepared;
  };

  /* return magic if value is undefined in dst */
  const getFillValue = (dst, k, magic) => {
    const value = jsonGetByPath(dst, k);
    return value === undefined ? magic : value;
  };

  /* Templates constructor */
  const constructor = (ts = _template) => {
    if (!_template && !ts)
      throw new TemplatesError(
        "Please provide a template string for templates manager constructor"
      );
    _template = ts;

    /* Getters */
    const getTemplate = _ => _template;
    const getTemplateVars = _ => _keys;
    const getTemplateUsed = _ => _used;

    /* eval string, track template keys */
    const prepare = (tpl = _template) => evalTemplateString(tpl);

    /* fill template string (tS) with template values (dst) */
    const jsonFill = (tS, keys, dst) => {
      let filled = tS;
      /* replace by value or by magic */
      keys.forEach(k => {
        /* replace "${val}" by "magic" */
        if (filled.includes('"${' + k + '}"'))
          filled = filled.replace(
            "${" + k + "}",
            getFillValue(dst, k, CONSTANTS.MAGIC)
          );
        /* or replace ${val} by "magic" */ else if (
          filled.includes("${" + k + "}")
        )
          filled = filled.replace(
            "${" + k + "}",
            getFillValue(dst, k, '"' + CONSTANTS.MAGIC + '"')
          );
      });
      /* get json from filled template */
      try {
        filled = JSON.parse(filled);
      } catch (e) {
        console.error(e);
      }
      /* remove magicified keys */
      jsonRemoveKeysContaining(filled, CONSTANTS.MAGIC);
      return filled;
    };

    return {
      getTemplate,
      getTemplateVars,
      prepare,
      jsonFill
    };
  };

  return constructor;
})();
