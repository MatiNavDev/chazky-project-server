const Response = require('.');

class ResponseError extends Response {
  constructor(res, error, status) {
    super();

    this.resp = { status: status || 500 };
    this.res = res;

    switch (typeof error) {
      case 'string':
        this.resp.message = error;
        break;
      case 'object':
        this.resp.message = error.message || 'Algo salio Mal !';
        break;
      default:
        break;
    }

    return this;
  }
}

module.exports = ResponseError;
