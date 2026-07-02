import { authService } from '../services/auth.service.js';

export const signUp = async (request, response, next) => {
  try {
    const result = await authService.signUp(request.body);
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const signIn = async (request, response, next) => {
  try {
    const result = await authService.signIn(request.body);
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    response.json(result);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (_request, response, next) => {
  try {
    response.clearCookie('access_token');
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
