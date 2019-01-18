class BusinessError extends Error {
  constructor({
    code = undefined, httpCode = undefined, messages = ['Generic Error'],
  }) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.httpCode = httpCode;
    this.messages = messages || ['Generic Error'];
  }
}

module.exports = BusinessError;
