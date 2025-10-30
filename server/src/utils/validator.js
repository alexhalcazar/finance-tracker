/**
 * Password validation utility
 * Ensures passwords meet security requirements
 */

/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 *
 * @param {string} password - The password to validate
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export function validatePasswordStrength(password) {
  const errors = [];

  if (!password || typeof password !== "string") {
    return { isValid: false, errors: ["Password is required"] };
  }

  // Minimum length check
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Maximum length check
  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }

  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== "string") return false;

  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates username
 * Requirements:
 * - 3-30 characters
 * - Alphanumeric and underscores only
 * - Cannot start with a number
 *
 * @param {string} username - The username to validate
 * @returns {object} { isValid: boolean, error: string|null }
 */
export function validateUsername(username) {
  if (!username || typeof username !== "string") {
    return { isValid: false, error: "Username is required" };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      error: "Username must be at least 3 characters long",
    };
  }

  if (username.length > 30) {
    return { isValid: false, error: "Username must not exceed 30 characters" };
  }

  if (/^\d/.test(username)) {
    return { isValid: false, error: "Username cannot start with a number" };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      error: "Username can only contain letters, numbers, and underscores",
    };
  }

  return { isValid: true, error: null };
}
