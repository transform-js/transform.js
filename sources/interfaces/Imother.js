import { InterfaceError } from '../core/errors.js'

class Imother {
  constructor () {
    if (this.get === undefined || typeof this.get !== 'function') {
      throw new InterfaceError(
        'Interface .get() method should be defined and return formatted data'
      )
    }
  }
}

export default Imother
