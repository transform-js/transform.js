import CONSTANTS from './constants.js'
import { DispatcherError } from './errors.js'

export default class Dispatcher {
  /*
    src: source data (the raw data to be transformed)
    to: interface (your plugin code where you can pre/post process. See 'example')
    id: identity (Your configuration entrypoint. See 'test')
    kind: kind of data (e.g. metrics, errors)
    lang: template format (e.g. json, xml, custom)
    */
  async format (src, id, to, kind, lang = CONSTANTS.LANG_JSON) {
    try {
      const I = await import('../interfaces/' + to + '/I' + to + '.js')
      return new I.default(src, id.toLowerCase(), kind, lang).get() // eslint-disable-line new-cap
    } catch (e) {
      throw new DispatcherError('Cannot import interface ' + to + '.')
    }
  }

  /*
    This 'call' function takes an interface function name and its arguments.
    You can use it to reach some interface static code out of the transformation
    process. For example, you wan't to decide which 'kind' to use (e.g. metrics
    or errors) based on some external data (e.g. an http status code).
    */
  async call (iface, fn, ...args) {
    try {
      return iface[fn](...args)
    } catch (e) {
      throw new DispatcherError('Function not found for that interface.')
    }
  }
}
