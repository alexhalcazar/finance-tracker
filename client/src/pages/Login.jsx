import { AuthForm } from "@/features/auth/AuthForm";
import "@/styles/Auth.css";
import { Link } from "react-router";
import { Card } from "@/components/ui/Card";

export function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center ">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl text-primary font-bold">Login</h2>
          <p className="text-base text-muted">
            Welcome back to pocket budget, jump back below.
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <AuthForm className="auth-form" formType="login" />

          <div className="text-center">
            <p className="text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link
                to="/auth/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
