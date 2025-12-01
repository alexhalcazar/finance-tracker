import { AuthForm } from "@/features/auth/AuthForm";
import GoogleLoginButton from "@/features/auth/GoogleLoginButton";

import { Link } from "react-router";
import { Card } from "@/components/ui/Card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/formSchemas/allFormSchemas";
import { useState } from "react";

export function Login() {
  const [isLoading, setIsLoading] = useState(false);

  //  Stateful form object passed to authForm, default values denotes first page load and after "resets"
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      console.log("Login Data\n", data);
    } catch (error) {
      console.error("Login page error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <AuthForm
            formType="login"
            form={loginForm}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Google Login Button */}
          <GoogleLoginButton />

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
