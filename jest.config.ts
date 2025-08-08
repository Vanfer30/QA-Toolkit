import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.jest.json'
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/tests/**/*.test.ts'],

  coverageReporters: ['json-summary', 'text', 'lcov']
}

export default config