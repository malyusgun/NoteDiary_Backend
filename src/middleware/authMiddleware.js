import TokenService from '../services/tokenService';

export default function (req, res, next) {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return next(ApiError.throwUnauthorizedException());
    }

    const validatedAccessToken = TokenService.validateAccessToken(accessToken);
    if (!validatedAccessToken) {
      return next(ApiError.throwForbiddenException());
    }

    next();
  } catch (e) {
    return next(ApiError.throwServerError());
  }
}
