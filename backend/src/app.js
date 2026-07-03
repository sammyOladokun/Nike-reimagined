import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env.js';
import { healthRouter } from './routes/health.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { orderRouter } from './routes/order.routes.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(
  cors({
    origin: env.NODE_ENV === 'development' ? true : env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (_request, response) => {
  response.json({
    name: 'Nike Reimagined API',
    status: 'ok',
  });
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
