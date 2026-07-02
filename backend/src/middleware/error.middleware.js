export const errorHandler = (error, _request, response, _next) => {
  const statusCode = response.statusCode >= 400 ? response.statusCode : 500;

  response.status(statusCode).json({
    message: error.message || 'Something went wrong',
  });
};
