import { expect, test, describe, beforeAll } from "vitest";

describe("JWT Utils", () => {
  let generateAccessToken;
  let verifyAccessToken;

  // Load the module AFTER setting environment variables
  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET = "test-secret-key-for-testing";
    process.env.JWT_ACCESS_TTL = "15m";

    // Dynamic import after env vars are set
    const jwtUtils = await import("../../src/utils/jwtUtils.js");
    generateAccessToken = jwtUtils.generateAccessToken;
    verifyAccessToken = jwtUtils.verifyAccessToken;
  });
  const mockUser = {
    user_id: 1,
    username: "testuser",
    email: "test@example.com",
  };

  describe("generateAccessToken", () => {
    test("should generate a valid JWT token", () => {
      const token = generateAccessToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    test("should include user data in token payload", () => {
      const token = generateAccessToken(mockUser);
      const decoded = verifyAccessToken(token);

      expect(decoded.user_id).toBe(mockUser.user_id);
      expect(decoded.username).toBe(mockUser.username);
      expect(decoded.email).toBe(mockUser.email);
    });

    test("should include expiration in token", () => {
      const token = generateAccessToken(mockUser);
      const decoded = verifyAccessToken(token);

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe("verifyAccessToken", () => {
    test("should verify a valid token", () => {
      const token = generateAccessToken(mockUser);
      const decoded = verifyAccessToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.user_id).toBe(mockUser.user_id);
    });

    test("should throw error for invalid token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => verifyAccessToken(invalidToken)).toThrow();
    });

    test("should throw error for tampered token", () => {
      const token = generateAccessToken(mockUser);
      const tamperedToken = token.slice(0, -5) + "xxxxx";

      expect(() => verifyAccessToken(tamperedToken)).toThrow();
    });

    test("should throw error for empty token", () => {
      expect(() => verifyAccessToken("")).toThrow();
      expect(() => verifyAccessToken(null)).toThrow();
      expect(() => verifyAccessToken(undefined)).toThrow();
    });
  });
});
