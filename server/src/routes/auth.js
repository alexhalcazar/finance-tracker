import express from "express";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { generateAccessToken } from "../utils/jwtUtils.js";
import {
  validatePasswordStrength,
  validateEmail,
  validateUsername,
} from "../utils/validator.js";
import {
  insertUser,
  selectUserByEmail,
  selectUserByUsername,
} from "../models/userModel.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";
import passport from "../config/passport.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 *
 * Body:
 * - username: string (3-30 chars, alphanumeric + underscore)
 * - email: string (valid email format)
 * - password: string (min 8 chars, must meet strength requirements)
 *
 * Returns:
 * - 201: { message, user: { user_id, username, email }, token }
 * - 400: { error, details? }
 * - 409: { error } (user already exists)
 * - 500: { error }
 */
router.post("/register", registerLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password are required",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return res.status(400).json({
        error: usernameValidation.error,
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: "Password does not meet strength requirements",
        details: passwordValidation.errors,
      });
    }

    // Check if email already exists
    const existingEmail = await selectUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    // Check if username already exists
    const existingUsername = await selectUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        error: "Username already taken",
      });
    }

    // Hash the password
    const password_hash = await hashPassword(password);

    // Create user object
    const userObj = {
      username,
      email: email.toLowerCase(), // Store emails in lowercase
      password_hash,
    };

    // Insert user into database
    const newUser = await insertUser(userObj);

    // Generate JWT token
    const token = generateAccessToken(newUser);

    // Return success response (don't include password_hash)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      error: "Registration failed. Please try again later.",
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate a user and return a JWT token
 *
 * Body:
 * - email: string
 * - password: string
 *
 * Returns:
 * - 200: { message, user: { user_id, username, email }, token }
 * - 400: { error }
 * - 401: { error } (invalid credentials)
 * - 500: { error }
 */
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user by email
    const user = await selectUserByEmail(email.toLowerCase());
    if (!user) {
      // Use generic error message to prevent user enumeration
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateAccessToken(user);

    // Return success response
    return res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Login failed. Please try again later.",
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout endpoint (for JWT, this is handled client-side)
 * This endpoint exists for consistency and can be used for:
 * - Audit logging (track when users logout)
 * - Future token blacklisting
 * - Analytics
 *
 * Optional: Can be called with Authorization header to log which user logged out
 *
 * Returns:
 * - 200: { message }
 */
router.post("/logout", (req, res) => {
  // For JWT-based auth, logout is primarily handled client-side
  // by removing the token from storage

  //Log the logout event
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      console.log(
        `User ${decoded.email} logged out at ${new Date().toISOString()}`
      );
      // Future: Add to token blacklist here
      // Future: Log to database for audit trail
    } catch (err) {
      // Token invalid or expired, but that's okay for logout
    }
  }

  return res.status(200).json({
    message: "Logout successful. Token removed from client.",
  });
});

//google API
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  (req, res) => {
    try {
      const user = req.user;
      const token = generateAccessToken(user);

      res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(
          JSON.stringify({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            profile_picture: user.profile_picture,
          })
        )}`
      );
    } catch (error) {
      console.error("Error in Google OAuth callback:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
  }
);

export default router;
