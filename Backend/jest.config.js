export default {
  testEnvironment: 'node',
  transform: {}, // Disable Babel transformation as we use Node's native ESM
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],
  verbose: true,
};
