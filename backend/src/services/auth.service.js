import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { conflict, unauthorized } from '../lib/errors.js';
import { userRepository } from '../repositories/user.repository.js';

const authPayloadSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters long').optional(),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const issueToken = (user) =>
  jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const signUp = async (payload) => {
  const data = authPayloadSchema.parse(payload);
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw conflict('An account with that email already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await userRepository.create({
    name: data.name ?? 'Nike Customer',
    email: data.email,
    passwordHash,
  });

  const token = issueToken(user);

  return {
    user: sanitizeUser(user),
    accessToken: token,
  };
};

const signIn = async (payload) => {
  const data = authPayloadSchema.pick({ email: true, password: true }).parse(payload);
  const user = await userRepository.findByEmail(data.email);

  if (!user) {
    throw unauthorized('Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);

  if (!passwordMatches) {
    throw unauthorized('Invalid email or password');
  }

  const token = issueToken(user);

  return {
    user: sanitizeUser(user),
    accessToken: token,
  };
};

const getSession = async (authorizationHeader) => {
  const token = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice('Bearer '.length)
    : authorizationHeader;

  if (!token) {
    return { user: null };
  }

  let decoded;

  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    return { user: null };
  }

  const userId = Number(decoded.sub);
  const user = await userRepository.findById(userId);

  if (!user) {
    return { user: null };
  }

  return { user: sanitizeUser(user) };
};

export const authService = {
  signUp,
  signIn,
  getSession,
};
