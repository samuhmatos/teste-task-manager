/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.interface.(t|j)s',
    '!**/*.controller.(t|j)s',
    '!**/tests/**',
    '!**/*.enum.(t|j)s',
    '!**/index.(t|j)s',
    '!**/constants/**',
    '!**/main.ts',
    '!**/database/**',
    '!**/*.module.(t|j)s',
    '!**/*.dto.(t|j)s',
    '!**/*.entity.(t|j)s',
    '!**/*.decorator.(t|j)s',
    '!**/*.guard.(t|j)s',
    '!**/*.d.ts',
    '!**/*.config.(t|j)s',
    '!**/.*.(t|j)s',
    '!**/*.repository.(t|j)s',
    '!**/*.provider.(t|j)s',
    '!**/infra/**',
    '!**/presentation/**',
    '!**/test/**',
    '!**/coverage/**',
    '!*/data/**',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/data/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/data/'],
  watchPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/data/'],
};
