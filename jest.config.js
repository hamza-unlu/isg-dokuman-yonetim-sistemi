module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/firmaController.js',
    'controllers/personelController.js',
    'controllers/dokumanController.js',
    'controllers/authController.js',
    'controllers/egitimController.js',
    'controllers/egitimTuruController.js',
    'controllers/mevzuatController.js',
    'controllers/naceController.js',
    'middleware/authMiddleware.js',
    'middleware/roleMiddleware.js'
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'json-summary'],
  coverageThreshold: {
    global: { statements: 60, branches: 40, functions: 60, lines: 60 }
  }
};
