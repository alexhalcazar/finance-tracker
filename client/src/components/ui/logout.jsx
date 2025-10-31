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
   * 1. Notify server (for logging/auditing)
   * 2. Removes JWT token from localStorage/sessionStorage
   * 3. Redirects user to the login page
   */
  const handleLogout = async () => {
    try {
      // Call server logout endpoint (for audit logging)
      const token = localStorage.getItem("accessToken");
      if (token) {
        await fetch("http://localhost:8080/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        // Note: We don't care if this fails - we still logout client-side
      }
    } catch (error) {
      // Server call failed, but we still logout client-side
      console.log("Server logout call failed, proceeding with client logout");
    } finally {
      // Always remove the token from storage
      logout();

      // Redirect to login page
      navigate("/auth/login");
    }
  };

  return (
    <Button variant="outline" size="default" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
