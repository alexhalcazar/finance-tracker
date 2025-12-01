/**
 * Migration: Add OAuth fields to users table
 *
 * This migration adds support for OAuth authentication (like Google login)
 * by adding columns to track OAuth provider information.
 */

export const up = async (knex) => {
  try {
    await knex.schema.table("users", (table) => {
      // Add oauth_provider column
      // This stores which service the user logged in with: 'google', 'github', or 'local' (email/password)
      table.string("oauth_provider", 50);

      // Add oauth_id column
      // This stores the unique ID that the OAuth provider gives to this user
      table.string("oauth_id", 255);

      // Add profile_picture column
      // This stores the URL to the user's profile picture from their OAuth provider
      table.string("profile_picture", 500);
    });

    console.log("✅ Successfully added OAuth fields to users table");
  } catch (error) {
    console.error("❌ Error adding OAuth fields:", error);
    throw error;
  }
};

/**
 * Rollback function - removes the columns we added
 * Runs if you need to undo this migration
 */
export const down = async (knex) => {
  try {
    await knex.schema.table("users", (table) => {
      // Remove the columns in reverse order
      table.dropColumn("profile_picture");
      table.dropColumn("oauth_id");
      table.dropColumn("oauth_provider");
    });

    console.log("✅ Successfully removed OAuth fields from users table");
  } catch (error) {
    console.error("❌ Error removing OAuth fields:", error);
    throw error;
  }
};
