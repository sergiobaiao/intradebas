export function createPrismaMock() {
  return {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    athlete: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    team: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    sport: {
      findMany: jest.fn(),
    },
    registration: {
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

