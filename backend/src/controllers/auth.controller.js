import { env } from '../config/env.js';
import { authService } from '../services/auth.service.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: env.NODE_ENV === 'production',
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const signUp = async (request, response, next) => {
  try {
    const result = await authService.signUp(request.body);
    response.cookie('access_token', result.accessToken, cookieOptions);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const signIn = async (request, response, next) => {
  try {
    const result = await authService.signIn(request.body);
    response.cookie('access_token', result.accessToken, cookieOptions);
    response.json(result);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (_request, response, next) => {
  try {
    response.clearCookie('access_token', cookieOptions);
    response.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSession = async (request, response, next) => {
  try {
    const session = await authService.getSession(request.cookies?.access_token ?? request.headers.authorization);
    response.json(session);
  } catch (error) {
    next(error);
  }
};
