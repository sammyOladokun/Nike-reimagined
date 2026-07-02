const users = new Map();
let nextUserId = 1;

const create = async ({ name, email, passwordHash }) => {
  const now = new Date().toISOString();
  const user = {
    id: nextUserId++,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'customer',
    createdAt: now,
    updatedAt: now,
  };

  users.set(user.id, user);
  return user;
};

const findByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();

  for (const user of users.values()) {
    if (user.email === normalizedEmail) {
      return user;
    }
  }

  return null;
};

const findById = async (id) => users.get(id) ?? null;

export const userRepository = {
  create,
  findByEmail,
  findById,
};
