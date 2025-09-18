import { AuthForm } from "@/components/AuthForm";
import "@/styles/Auth.css";
import { Link } from "react-router";

export function Login() {
  return (
    <main className="auth-container">
      <div className="auth-header">
        <h2>Login</h2>
        <p>Welcome back to pocket budget, jump back below.</p>
      </div>

      <div className="auth-card">
        <AuthForm className="auth-form" formType="login" />
        <p>
          Don&apos;t have an account?
          <span>
            <Link to="/auth/register">Register</Link>
          </span>
        </p>
      </div>
    </main>
  );
}
