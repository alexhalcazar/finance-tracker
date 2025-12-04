import { AuthForm } from "@/features/auth/AuthForm";

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
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        errorData = await response.json();
        console.error("Error:", errorData.error);
        return;
      }

      const result = await response.json();
      const token = result.token;
      sessionStorage.setItem("token", token);
      window.location.replace("http://localhost:5173/dashboard");
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
