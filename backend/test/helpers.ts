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
    result: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    scoringConfig: {
      findFirst: jest.fn(),
    },
    sponsorshipQuota: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    sponsor: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
    sport: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    registration: {
      createMany: jest.fn(),
    },
    coupon: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}
