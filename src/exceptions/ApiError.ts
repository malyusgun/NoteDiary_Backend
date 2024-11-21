const ApiError = {
  throwUnauthorizedException() {
    return {
      status: 401,
      message: 'Unauthorized'
    };
  },
  throwForbiddenException() {
    return {
      status: 403,
      message: 'Forbidden'
    };
  },
  throwServerError() {
    return {
      status: 500,
      message: 'Server Error'
    };
  }
};

export default ApiError;
