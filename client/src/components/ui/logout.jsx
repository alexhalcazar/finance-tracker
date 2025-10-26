import { useNavigate } from "react-router";
import { logout } from "../../utils/auth.js";
import { Button } from "./Button.jsx";

/**
 * LogoutButton Component
 *
 * Handles user logout by clearing authentication tokens and redirecting to login page.
 * Uses the existing Button component for consistent styling across the app.
 */
const LogoutButton = () => {
  // Hook for programmatic navigation between routes
  const navigate = useNavigate();

  /**
   * Handles the logout process
   * 1. Removes JWT token from localStorage/sessionStorage
   * 2. Redirects user to the login page
   */
  const handleLogout = () => {
    // Remove the JWT token from storage
    logout();

    // Redirect to login page
    navigate("/Login");
  };

  return (
    <Button variant="outline" size="default" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
