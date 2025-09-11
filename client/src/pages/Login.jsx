import { AuthForm } from "@/components/AuthForm";
import "@/styles/Login.css";

export function Login() {
  return (
    <main className="login-container">
      <div className="login-header">
        <h2>Login</h2>
        <p>Welcome back to pocket budget, jump back below.</p>
      </div>

      <div className="login-card">
        <AuthForm className="auth-form" />
      </div>
    </main>
  );
}
