import { AuthForm } from "@/components/AuthForm";
import { Link } from "react-router";
import "@/styles/Auth.css";

export function Register() {
  return (
    <main className="auth-container">
      <div className="auth-header">
        <h2>Register</h2>
        <p>Your pocket budget awaits, register an account with us!</p>
      </div>

      <div className="auth-card">
        <AuthForm className="auth-form" formType="register" />
        <p>
          Already have an account?
          <span>
            <Link to="/auth/login">Login</Link>
          </span>
        </p>
      </div>
    </main>
  );
}
