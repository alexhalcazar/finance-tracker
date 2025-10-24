import { AuthForm } from "@/features/auth/AuthForm";
import { Card } from "@/components/ui/Card";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/formSchemas/allFormSchemas";
import { useState } from "react";

export function Register() {
  const [isLoading, setIsLoading] = useState(false);

  //  Stateful register form object passed to authForm, default values denotes first page load and after "resets"
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
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
          <h2 className="text-3xl text-primary font-bold">Register</h2>
          <p className="text-base text-muted">
            Your pocket budget awaits, create an account with us!
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <AuthForm
            formType="register"
            form={registerForm}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />

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
