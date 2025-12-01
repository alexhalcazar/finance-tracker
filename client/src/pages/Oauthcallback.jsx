/**
 * OAuth Callback Page
 *
 * This page is where Google redirects users after they successfully log in.
 * It extracts the JWT token from the URL and stores it, then redirects to the dashboard.
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extract token and user from URL parameters
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const errorParam = searchParams.get("error");

    // Check if there was an error
    if (errorParam) {
      console.error("❌ OAuth error:", errorParam);
      setError("Authentication failed. Please try again.");
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    // Check if we have the required data
    if (!token || !userParam) {
      console.error("❌ Missing token or user data in callback");
      setError("Invalid authentication response. Please try again.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    try {
      // Parse user data
      const user = JSON.parse(decodeURIComponent(userParam));

      // Store token and user info in localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("✅ OAuth login successful! User:", user.email);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error processing OAuth callback:", error);
      setError("Failed to process login. Please try again.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Authentication Error
            </h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to login page...
            </p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Completing sign in...
            </h2>
            <p className="text-gray-600">Please wait a moment</p>
          </>
        )}
      </div>
    </div>
  );
}
