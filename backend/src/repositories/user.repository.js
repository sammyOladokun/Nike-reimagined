import { prisma } from '../lib/prisma.js';

const create = async ({ name, email, passwordHash }) => {
  return prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
    },
  });
};

const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
};

const findById = async (id) =>
  prisma.user.findUnique({
    where: {
      id,
    },
  });

export const userRepository = {
  create,
  findByEmail,
  findById,
};
