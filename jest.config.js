module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/firmaController.js',
    'controllers/personelController.js',
    'middleware/authMiddleware.js',
    'middleware/roleMiddleware.js'
  ],
  coverageThreshold: {
    global: { statements: 50, branches: 30, functions: 50, lines: 50 }
  }
};