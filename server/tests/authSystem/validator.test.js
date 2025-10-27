import { expect, test, describe } from "vitest";
import {
  validatePasswordStrength,
  validateEmail,
  validateUsername,
} from "../../src/utils/validator.js";

describe("Password Validator", () => {
  describe("validatePasswordStrength", () => {
    test("should accept a strong password", () => {
      const result = validatePasswordStrength("StrongPass123!");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should reject password without uppercase letter", () => {
      const result = validatePasswordStrength("weakpass123!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one uppercase letter"
      );
    });

    test("should reject password without lowercase letter", () => {
      const result = validatePasswordStrength("WEAKPASS123!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one lowercase letter"
      );
    });

    test("should reject password without number", () => {
      const result = validatePasswordStrength("WeakPass!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one number"
      );
    });

    test("should reject password without special character", () => {
      const result = validatePasswordStrength("WeakPass123");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one special character"
      );
    });

    test("should reject password shorter than 8 characters", () => {
      const result = validatePasswordStrength("Weak1!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must be at least 8 characters long"
      );
    });

    test("should reject password longer than 128 characters", () => {
      const longPassword = "A".repeat(129) + "a1!";
      const result = validatePasswordStrength(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must not exceed 128 characters"
      );
    });

    test("should reject null or undefined password", () => {
      const result1 = validatePasswordStrength(null);
      const result2 = validatePasswordStrength(undefined);
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.errors).toContain("Password is required");
    });
  });

  describe("validateEmail", () => {
    test("should accept valid email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
      expect(validateEmail("user+tag@example.com")).toBe(true);
    });

    test("should reject invalid email addresses", () => {
      expect(validateEmail("notanemail")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("user @example.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe("validateUsername", () => {
    test("should accept valid usernames", () => {
      const result1 = validateUsername("validuser");
      const result2 = validateUsername("user_123");
      const result3 = validateUsername("abc");

      expect(result1.isValid).toBe(true);
      expect(result2.isValid).toBe(true);
      expect(result3.isValid).toBe(true);
    });

    test("should reject username shorter than 3 characters", () => {
      const result = validateUsername("ab");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Username must be at least 3 characters long");
    });

    test("should reject username longer than 30 characters", () => {
      const result = validateUsername("a".repeat(31));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Username must not exceed 30 characters");
    });

    test("should reject username starting with number", () => {
      const result = validateUsername("123user");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Username cannot start with a number");
    });

    test("should reject username with special characters", () => {
      const result = validateUsername("user@name");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        "Username can only contain letters, numbers, and underscores"
      );
    });

    test("should reject null or undefined username", () => {
      const result1 = validateUsername(null);
      const result2 = validateUsername(undefined);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.error).toBe("Username is required");
    });
  });
});
