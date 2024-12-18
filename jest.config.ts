import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json'
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '**/src/**/*.test.ts',
    '**/src/**/*.test.tsx'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/dist/'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/test/'
  ],
  clearMocks: true,
  resetMocks: true
};

export default config; 