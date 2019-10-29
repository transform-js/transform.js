export class DispatcherError extends Error {
  constructor (message) {
    super(message)
    this.name = 'DispatcherError'
    this.message = message
  }
}

export class TemplatesError extends Error {
  constructor (message) {
    super(message)
    this.name = 'TemplatesError'
    this.message = message
  }
}

export class InterfaceError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InterfaceError'
    this.message = message
  }
}

export class FormatterError extends Error {
  constructor (message) {
    super(message)
    this.name = 'FormatterError'
    this.message = message
  }
}

export class MutationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'MutationError'
    this.message = message
  }
}
