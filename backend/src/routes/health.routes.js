import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', (_request, response) => {
  response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

router.get('/db', async (_request, response, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    response.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export const healthRouter = router;
