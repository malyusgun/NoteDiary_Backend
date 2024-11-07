class ApiError extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }

  static throwUnauthorizedException() {
    return new ApiError(401, 'Unauthorized');
  }

  static throwForbiddenException() {
    return new ApiError(403, 'Forbidden');
  }

  static throwServerError() {
    return new ApiError(500, 'ServerError');
  }
}
