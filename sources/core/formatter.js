import Templates from './templates.js'
import { FormatterError } from './errors.js'
import { jsonGetByPath, jsonSetbyPath, cleanObject } from './utils.js'
import CONSTANTS from './constants.js'

export default class Formatter {
  constructor (src, ops, template) {
    /* dst is the return value */
    this.dst = {}
    this.templatesManager = new Templates(template)

    /* Iterate operations */
    ops.forEach(o => {
      o.mutations = this.arrayify(o.mutations)
      /* Will fill dst with transformed values */
      this.operate(src, this.dst, this.getPlaceholders(o), o)
    })
  }

  format (lang = CONSTANTS.LANG_JSON) {
    if (lang !== CONSTANTS.LANG_JSON) { throw new FormatterError('Only json is supported at the moment') }

    const prepared = this.templatesManager.prepare()
    // console.log("Prepared template =", prepared);
    const vars = this.templatesManager.getTemplateVars()
    // console.log("Template vars =",vars);
    const filled = this.templatesManager.jsonFill(prepared, vars, this.dst)
    // console.log("Filled template =", JSON.stringify(filled));
    const cleaned = cleanObject(filled)
    // console.log("Cleaned template =", JSON.stringify(cleaned));
    return cleaned
  }

  arrayify (m) {
    return typeof m === 'function' ? [m] : m
  }

  getPlaceholders (o) {
    return {
      /* retrieve from where to read source data (the source data path) */
      from: o.from || o.placeholder,
      /* retrieve from where to write destination data (the template placeholder) */
      to: o.to || o.placeholder
    }
  }

  /* Run the operation */
  operate (src, dst, placeholders, o) {
    /* Iterate mutations */
    o.mutations.forEach(m => {
      if (typeof m === 'function') {
        /* unary mutation (1-ary) */
        this.unaryMutation(src, dst, placeholders, m)
      } else if (Object.prototype.hasOwnProperty.call(m, 'variadic')) {
        /* variadic mutations (n-ary) */
        this.variadicMutation(src, dst, placeholders, m)
      } else {
        throw new FormatterError('Unknow mutation type')
      }
    })
  }

  /* mutation with one argument */
  unaryMutation (src, dst, placeholders, m) {
    /* replace placeholder pointed value according to the mutation function */
    const toBeOperatedOn = jsonGetByPath(src, placeholders.from)
    jsonSetbyPath(dst, m(src, dst, toBeOperatedOn), placeholders.to)
  }

  /* mutation with multiple arguments */
  variadicMutation (src, dst, placeholders, m) {
    /* replace placeholder pointed value according to the mutation function its arguments */
    const toBeOperatedOn = jsonGetByPath(src, placeholders.from)
    jsonSetbyPath(
      dst,
      m.variadic(src, dst, toBeOperatedOn, m.arguments),
      placeholders.to
    )
  }
}
