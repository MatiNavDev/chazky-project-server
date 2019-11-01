const Response = require('.');

class ResponseSuccess extends Response {
  constructor(res, data, status) {
    super();

    this.resp = { status: status || 200, data };
    this.res = res;

    return this;
  }
}

module.exports = ResponseSuccess;
