const ResponseError = require('./ResponsesStrategy/ResponseError');
const ResponseSuccess = require('./ResponsesStrategy/ResponseSuccess');

const handleCommonError = (res, error) => {
  const respError = new ResponseError(res, error, error.status);
  respError.sendResponse();
};

const handleCommonResponse = (res, success, status) => {
  const respSuccess = new ResponseSuccess(res, success, status);
  respSuccess.sendResponse();
};

module.exports = {
  handleCommonError,
  handleCommonResponse
};
