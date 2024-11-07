import jwt from 'jsonwebtoken';

class TokenService {
  generateTokens(payload: { user_uuid: string; password: string }) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: 600 });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken
    };
  }

  async validateAccessToken(accessToken: string) {
    return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
  }

  async validateRefreshToken(refreshToken: string) {
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
  }
}

export default new TokenService();
