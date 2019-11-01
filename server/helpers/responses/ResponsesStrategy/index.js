class ResponsesStrategy {
  sendResponse() {
    this.res.status(this.resp.status).send(this.resp);
  }
}

module.exports = ResponsesStrategy;
