export class DispatcherError extends Error {
  constructor (message) {
    super(message)
    this.name = 'DispatcherError'
    this.message = message
    Error.captureStackTrace(this, DispatcherError)
  }
}

export class TemplatesError extends Error {
  constructor (message) {
    super(message)
    this.name = 'TemplatesError'
    this.message = message
    Error.captureStackTrace(this, TemplatesError)
  }
}

export class InterfaceError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InterfaceError'
    this.message = message
    Error.captureStackTrace(this, InterfaceError)
  }
}

export class FormatterError extends Error {
  constructor (message) {
    super(message)
    this.name = 'FormatterError'
    this.message = message
    Error.captureStackTrace(this, InterfaceError)
  }
}

export class MutationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'MutationError'
    this.message = message
    Error.captureStackTrace(this, MutationError)
  }
}
