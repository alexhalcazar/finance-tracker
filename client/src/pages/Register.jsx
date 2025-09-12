import { AuthForm } from "@/features/auth/AuthForm";
import { Card } from "@/components/ui/Card";
import { Link } from "react-router";

export function Register() {
  return (
    <main className="min-h-screen flex items-center justify-center ">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl text-primary font-bold">Register</h2>
          <p className="text-base text-muted">
            Your pocket budget awaits, register an account with us!
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <AuthForm className="auth-form" formType="register" />

          <div className="text-center">
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
