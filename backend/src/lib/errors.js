export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export const badRequest = (message) => new AppError(400, message);
export const unauthorized = (message) => new AppError(401, message);
export const conflict = (message) => new AppError(409, message);
export const notFound = (message) => new AppError(404, message);
