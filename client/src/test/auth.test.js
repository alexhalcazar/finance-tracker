import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { logout, isAuthenticated, getAccessToken } from "../utils/auth.js";

describe("Auth Utility Functions - Client Side", () => {
  // Clear localStorage before and after each test
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe("logout function", () => {
    test("should remove accessToken from localStorage", () => {
      // Setup: User has a token
      localStorage.setItem("accessToken", "test-token-123");
      expect(localStorage.getItem("accessToken")).toBe("test-token-123");

      // Action: User logs out
      logout();

      // Assert: Token is removed
      expect(localStorage.getItem("accessToken")).toBeNull();
    });

    test("should remove accessToken from sessionStorage", () => {
      // Setup: User has a token in sessionStorage
      sessionStorage.setItem("accessToken", "session-token-456");
      expect(sessionStorage.getItem("accessToken")).toBe("session-token-456");

      // Action: User logs out
      logout();

      // Assert: Token is removed from sessionStorage
      expect(sessionStorage.getItem("accessToken")).toBeNull();
    });

    test("should remove user data from localStorage", () => {
      // Setup: User data is stored
      const userData = JSON.stringify({ id: 1, email: "test@example.com" });
      localStorage.setItem("user", userData);
      expect(localStorage.getItem("user")).toBe(userData);

      // Action: User logs out
      logout();

      // Assert: User data is removed
      expect(localStorage.getItem("user")).toBeNull();
    });

    test("should remove refreshToken from localStorage", () => {
      // Setup: Refresh token is stored
      localStorage.setItem("refreshToken", "refresh-token-789");
      expect(localStorage.getItem("refreshToken")).toBe("refresh-token-789");

      // Action: User logs out
      logout();

      // Assert: Refresh token is removed
      expect(localStorage.getItem("refreshToken")).toBeNull();
    });

    test("should clear all auth-related data in one logout call", () => {
      // Setup: Multiple items stored
      localStorage.setItem("accessToken", "access-token");
      localStorage.setItem("refreshToken", "refresh-token");
      localStorage.setItem("user", '{"id":1}');
      sessionStorage.setItem("accessToken", "session-access-token");

      // Verify all are stored
      expect(localStorage.getItem("accessToken")).toBeTruthy();
      expect(localStorage.getItem("refreshToken")).toBeTruthy();
      expect(localStorage.getItem("user")).toBeTruthy();
      expect(sessionStorage.getItem("accessToken")).toBeTruthy();

      // Action: Single logout call
      logout();

      // Assert: Everything is removed
      expect(localStorage.getItem("accessToken")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
      expect(sessionStorage.getItem("accessToken")).toBeNull();
    });

    test("should not throw error when logging out without existing tokens", () => {
      // Setup: No tokens stored
      expect(localStorage.getItem("accessToken")).toBeNull();

      // Action & Assert: Should not throw error
      expect(() => logout()).not.toThrow();
    });
  });

  describe("isAuthenticated function", () => {
    test("should return true when accessToken exists in localStorage", () => {
      // Setup: User has token
      localStorage.setItem("accessToken", "valid-token");

      // Action & Assert
      expect(isAuthenticated()).toBe(true);
    });

    test("should return false when accessToken does not exist", () => {
      // Setup: No token
      expect(localStorage.getItem("accessToken")).toBeNull();

      // Action & Assert
      expect(isAuthenticated()).toBe(false);
    });

    test("should return false after logout", () => {
      // Setup: User is logged in
      localStorage.setItem("accessToken", "token-123");
      expect(isAuthenticated()).toBe(true);

      // Action: User logs out
      logout();

      // Assert: No longer authenticated
      expect(isAuthenticated()).toBe(false);
    });

    test("should return true for any non-empty token string", () => {
      // Various token formats should all return true
      const tokens = [
        "simple-token",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "jwt.token.here",
        "12345",
      ];

      tokens.forEach((token) => {
        localStorage.setItem("accessToken", token);
        expect(isAuthenticated()).toBe(true);
        localStorage.clear();
      });
    });

    test("should return false for empty string token", () => {
      // Setup: Empty string token
      localStorage.setItem("accessToken", "");

      // Action & Assert: Empty string is falsy
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("getAccessToken function", () => {
    test("should return the accessToken when it exists", () => {
      // Setup: Token stored
      const testToken = "test-access-token-xyz";
      localStorage.setItem("accessToken", testToken);

      // Action & Assert
      expect(getAccessToken()).toBe(testToken);
    });

    test("should return null when accessToken does not exist", () => {
      // Setup: No token
      expect(localStorage.getItem("accessToken")).toBeNull();

      // Action & Assert
      expect(getAccessToken()).toBeNull();
    });

    test("should return null after logout", () => {
      // Setup: User has token
      localStorage.setItem("accessToken", "token-to-remove");
      expect(getAccessToken()).toBe("token-to-remove");

      // Action: Logout
      logout();

      // Assert: Returns null
      expect(getAccessToken()).toBeNull();
    });

    test("should return exact token string without modification", () => {
      // Setup: Complex JWT token
      const jwtToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.signature";
      localStorage.setItem("accessToken", jwtToken);

      // Action & Assert: Returns exact same string
      expect(getAccessToken()).toBe(jwtToken);
      expect(getAccessToken().length).toBe(jwtToken.length);
    });
  });

  describe("Complete Authentication Flow", () => {
    test("should handle full login-logout cycle", () => {
      // Initial state: Not authenticated
      expect(isAuthenticated()).toBe(false);
      expect(getAccessToken()).toBeNull();

      // Step 1: User logs in (token stored)
      const loginToken = "login-token-123";
      localStorage.setItem("accessToken", loginToken);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: 1, email: "user@test.com" })
      );

      // Verify logged in state
      expect(isAuthenticated()).toBe(true);
      expect(getAccessToken()).toBe(loginToken);
      expect(localStorage.getItem("user")).toBeTruthy();

      // Step 2: User logs out
      logout();

      // Verify logged out state
      expect(isAuthenticated()).toBe(false);
      expect(getAccessToken()).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });

    test("should handle multiple logout calls safely", () => {
      // Setup: User logged in
      localStorage.setItem("accessToken", "token");

      // First logout
      logout();
      expect(isAuthenticated()).toBe(false);

      // Second logout (already logged out)
      expect(() => logout()).not.toThrow();
      expect(isAuthenticated()).toBe(false);

      // Third logout (still safe)
      logout();
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("Security Tests", () => {
    test("should not leave any authentication traces after logout", () => {
      // Setup: Full user session
      localStorage.setItem("accessToken", "access-token");
      localStorage.setItem("refreshToken", "refresh-token");
      localStorage.setItem("user", '{"id":1,"email":"test@test.com"}');
      sessionStorage.setItem("accessToken", "session-token");

      // Action: Logout
      logout();

      // Assert: No auth data remains
      const localStorageKeys = Object.keys(localStorage);
      const authRelatedKeys = localStorageKeys.filter(
        (key) =>
          key.includes("token") || key.includes("Token") || key === "user"
      );

      expect(authRelatedKeys.length).toBe(0);
    });

    test("should ensure isAuthenticated is false after clearing all tokens", () => {
      // Setup: Multiple storage locations
      localStorage.setItem("accessToken", "token1");
      sessionStorage.setItem("accessToken", "token2");

      // Clear localStorage only (what logout does)
      logout();

      // Assert: isAuthenticated checks localStorage
      expect(isAuthenticated()).toBe(false);
    });
  });
});
