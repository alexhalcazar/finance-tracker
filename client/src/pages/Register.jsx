import { AuthForm } from "@/components/AuthForm";
import { Card } from "@/components/ui/Card";
import { Link } from "react-router";

export function Register() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Register</h2>
          <p className="text-gray-600">
            Your pocket budget awaits, register an account with us!
          </p>
        </div>

        <div className="space-y-6">
          <AuthForm className="auth-form" formType="register" />

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </main>
  );
}
