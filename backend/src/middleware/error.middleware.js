import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';

export const errorHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    const flattened = error.flatten();

    return response.status(400).json({
      message: error.issues[0]?.message ?? 'Validation failed',
      fieldErrors: flattened.fieldErrors,
      issues: error.issues,
    });
  }

  const statusCode = error instanceof AppError
    ? error.statusCode
    : (error.statusCode || (response.statusCode >= 400 ? response.statusCode : 500));

  return response.status(statusCode).json({
    message: error.message || 'Something went wrong',
  });
};
