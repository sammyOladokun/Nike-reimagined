import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';

const readToken = (request) => {
  const cookieToken = request.cookies?.access_token;
  const headerToken = request.headers.authorization?.startsWith('Bearer ')
    ? request.headers.authorization.slice('Bearer '.length)
    : null;

  return cookieToken ?? headerToken;
};

export const requireAuth = async (request, response, next) => {
  try {
    const token = readToken(request);

    if (!token) {
      return response.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const userId = Number(decoded.sub);
    const user = await userRepository.findById(userId);

    if (!user) {
      return response.status(401).json({ message: 'Authentication required' });
    }

    request.user = user;
    return next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid or expired session' });
  }
};
