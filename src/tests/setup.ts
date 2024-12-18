import '@testing-library/jest-dom';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Types
export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

// Create mock client
export const createMockContext = (): MockContext => ({
  prisma: mockDeep<PrismaClient>()
});

export const prismaMock = createMockContext().prisma;

// Mock PrismaClient constructor
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock)
}));

// Mock external services
jest.mock('@pinecone-database/pinecone', () => ({
  PineconeClient: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
    index: jest.fn().mockImplementation(() => ({
      upsert: jest.fn().mockResolvedValue({ upsertedCount: 1 }),
      query: jest.fn().mockResolvedValue({ matches: [] })
    }))
  }))
}));

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    embeddings: {
      create: jest.fn().mockResolvedValue({ data: [{ embedding: new Array(1536).fill(0) }] })
    }
  }))
}));

// Reset mocks before each test
beforeEach(() => {
  mockReset(prismaMock);
});

// Mock console methods
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
}; 