class TemplatesError extends Error {
  constructor(message) {
    super(message);
    this.name = "TemplatesError";
    this.message = message;
  }
}

class InterfaceError extends Error {
  constructor(message) {
    super(message);
    this.name = "InterfaceError";
    this.message = message;
  }
}

class FormatterError extends Error {
  constructor(message) {
    super(message);
    this.name = "FormatterError";
    this.message = message;
  }
}

export { TemplatesError, InterfaceError, FormatterError };
