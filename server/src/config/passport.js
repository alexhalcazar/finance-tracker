/**
 * Passport Configuration for OAuth Authentication
 *
 * This file configures Passport.js to handle Google OAuth authentication.
 * It defines the strategy (how to authenticate with Google) and what to do
 * with the user information we get back from Google.
 */

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  insertUser,
  selectUserByEmail,
  selectUserByUsername,
} from "../models/userModel.js";

/**
 * Generate a unique username
 *
 * This function ensures the username is unique by checking the database.
 * If the base username exists, it appends a random number until finding a unique one.
 *
 * @param {string} baseUsername - The initial username to try
 * @returns {Promise<string>} A unique username
 */
async function generateUniqueUsername(baseUsername) {
  // Clean the base username (remove spaces, special chars, make lowercase)
  let username = baseUsername
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "") // Keep only letters, numbers, underscore
    .slice(0, 30); // Limit to 30 chars (your DB constraint)

  // If username is empty after cleaning, use a default
  if (!username) {
    username = "user";
  }

  // Check if this username exists
  let existingUser = await selectUserByUsername(username);

  // If username doesn't exist, we're good!
  if (!existingUser) {
    return username;
  }

  // Username exists! Try adding a random number until we find a unique one
  let attempts = 0;
  const maxAttempts = 10;

  while (existingUser && attempts < maxAttempts) {
    // Generate random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newUsername = `${username}${randomNum}`;

    // Check if this variation exists
    existingUser = await selectUserByUsername(newUsername);

    if (!existingUser) {
      return newUsername;
    }

    attempts++;
  }

  // If we still couldn't find one (very unlikely), use timestamp
  return `${username}${Date.now()}`;
}

/**
 * Configure Google OAuth Strategy
 *
 * This tells Passport how to authenticate users with Google.
 */
passport.use(
  new GoogleStrategy(
    {
      // Your Google OAuth credentials from .env
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      /**
       * This function runs AFTER Google successfully authenticates the user.
       *
       * Parameters:
       * - accessToken: Token from Google (we don't need to store this)
       * - refreshToken: Token to refresh access (we don't need this either)
       * - profile: User information from Google (email, name, picture, etc.)
       * - done: Callback function to tell Passport we're finished
       */

      try {
        // Extract user information from Google profile
        const email = profile.emails[0].value; // User's email from Google
        const googleId = profile.id; // Google's unique ID for this user
        const displayName = profile.displayName || email.split("@")[0]; // Display name or email prefix
        const profilePicture = profile.photos[0]?.value; // Profile picture URL

        console.log(`🔍 Google OAuth: User ${email} is trying to log in`);

        // Check if user already exists in our database
        let user = await selectUserByEmail(email);

        if (user) {
          // User exists! Check if they need OAuth info updated
          console.log(`✅ Existing user found: ${email}`);

          // If they previously signed up with email/password and now using Google,
          // update their record to include OAuth information
          if (!user.oauth_provider) {
            console.log(`📝 Updating user ${email} with OAuth information`);
            // Note: You'll need to create an update function in userModel.js
            // For now, we'll just use the existing user
          }

          return done(null, user);
        } else {
          // New user! Create account for them
          console.log(`🆕 Creating new user: ${email}`);

          // Generate a unique username (handles duplicates!)
          const uniqueUsername = await generateUniqueUsername(displayName);
          console.log(`📝 Generated unique username: ${uniqueUsername}`);

          const newUser = {
            username: uniqueUsername,
            email: email.toLowerCase(),
            password_hash: null, // No password for OAuth users
            oauth_provider: "google",
            oauth_id: googleId,
            profile_picture: profilePicture,
          };

          // Insert new user into database
          const createdUser = await insertUser(newUser);
          console.log(
            `✅ New user created: ${email} with username: ${uniqueUsername}`
          );

          return done(null, createdUser);
        }
      } catch (error) {
        console.error("❌ Error in Google OAuth strategy:", error);
        return done(error, null);
      }
    }
  )
);

/**
 * Serialize User
 * This determines what user information gets stored in the session.
 * We only store the user_id to keep sessions lightweight.
 */
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

/**
 * Deserialize User
 * This retrieves the full user object from the database using the user_id
 * stored in the session. This runs on every request for authenticated routes.
 */
passport.deserializeUser(async (id, done) => {
  try {
    // need a function to find user by ID
    done(null, { user_id: id });
  } catch (error) {
    done(error, null);
  }
});

export default passport;
