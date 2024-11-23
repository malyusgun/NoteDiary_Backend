import TokenService from '../services/tokenService';
import ApiError from '../exceptions/ApiError.js';

export default function (req, res, next) {
  try {
    const accessToken = req.cookies?.access_token;
    if (!accessToken) {
      console.log('throwUnauthorizedException');
      return next(ApiError.throwUnauthorizedException());
    }

    const validatedAccessToken = TokenService.validateAccessToken(accessToken);
    if (!validatedAccessToken) {
      console.log('throwForbiddenException');
      return next(ApiError.throwForbiddenException());
    }

    next();
  } catch (e) {
    console.log('auth error: ', e);
    return next(ApiError.throwServerError());
  }
}
