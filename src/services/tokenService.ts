import jwt from 'jsonwebtoken';
import { ITokenPayload } from '../interfaces';

class TokenService {
  generateTokens(payload: ITokenPayload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: 600 });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken
    };
  }

  generateAccessToken(payload: ITokenPayload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: 10 });
  }

  validateAccessToken(accessToken: string) {
    try {
      return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
    } catch {
      return null;
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    } catch {
      return null;
    }
  }
}

export default new TokenService();
