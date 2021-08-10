import CONSTANTS from './constants.js'
import { TemplatesError } from './errors.js'
import {
  jsonGetByPath,
  jsonRemoveKeysContaining
} from './utils.js'

let _keys = [] // FIXME: keeps growing

/* _ function is called from the template, out of Templates scope */
/* eslint-disable */
const _ = key => {
  /* keep track of template keys */
  _keys = [..._keys, key]
  /* inject new var in template */
  return '${' + key + '}'
}
/* eslint-enable */

export default class Templates {
  constructor (templateString) {
    if (!templateString) {
      throw new TemplatesError(
        'Please provide a template string for templates manager constructor'
      )
    }
    _keys = []
    this._template = templateString
  }

  /* return magic if value is undefined in dst */
  getFillValue (dst, k, magic) {
    const value = jsonGetByPath(dst, k)
    return value === undefined ? magic : value
  }

  /* eval string, track template keys */
  prepare (tpl = this._template) {
    /* eval template string, will hopefully call the underscore (_) function */
    return eval('`' + tpl + '`') // eslint-disable-line no-eval
  }

  /* fill prepared template with template values (dst) */
  jsonFill (prepared, keys, dst) {
    let filled = prepared
    /* replace by value or by magic */
    keys.forEach(k => {
      if (filled.includes('"${' + k + '}"')) {
        /* replace "${val}" by "magic" */
        filled = filled.replace(
          '${' + k + '}',
          this.getFillValue(dst, k, CONSTANTS.MAGIC)
        )
      } else if (filled.includes('${' + k + '}')) {
        /* or replace ${val} by "magic" */
        filled = filled.replace(
          '${' + k + '}',
          this.getFillValue(dst, k, '"' + CONSTANTS.MAGIC + '"')
        )
      }
    })
    /* get json from filled template */
    try {
      filled = JSON.parse(filled)
    } catch (e) {
      throw new TemplatesError('ParseError: cannot fill JSON')
    }
    /* remove magicified keys */
    jsonRemoveKeysContaining(filled, CONSTANTS.MAGIC)
    return filled
  }

  getTemplateVars () {
    return _keys
  }
}
