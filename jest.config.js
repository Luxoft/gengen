module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts', '!'],
  coveragePathIgnorePatterns: [
    'bin.ts',
    'gengen.ts',
  ]
};