// This runs before all tests

// Set environment variables for testing
process.env.JWT_ACCESS_SECRET = "test-secret-key-for-testing";
process.env.JWT_ACCESS_TTL = "15m";
process.env.BCRYPT_ROUNDS = "10";
