export default {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js',
    '!node_modules/**'
  ],
  coverageReporters: ['text', 'lcov', 'html']
};