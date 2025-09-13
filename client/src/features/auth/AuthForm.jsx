import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";

/**
 *
 * @prop {formType} uses if the parent form needs login or register form
 * @prop {form} passes the react hook form object to handle submission and validation
 * @prop {onSubmit} passes the function on what the form will submit to the submit button
 * @prop {isLoading} checks if the form is currently in a loading state
 * @prop {className} optional className to style parent auth form component
 */
export function AuthForm({
  formType,
  form,
  onSubmit,
  isLoading,
  className = "",
}) {
  //  Make text be register when passed in register, otherwise it is sign in
  const buttonCta = formType === "register" ? "Register" : "Sign In";

  //  Grab the parent form object passed from parent component, destructure their properties
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          id="email"
          {...register("email")}
        />
        <p className={cn([errors.email?.message && "text-error"])}>
          {errors.email?.message}
        </p>
      </div>

      <div className="pt-6 space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          id="password"
          {...register("password")}
        />
        <p className={cn([errors.password?.message && "text-error"])}>
          {errors.password?.message}
        </p>
      </div>

      {formType === "register" && (
        <>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            placeholder="Confirm your password"
            id="confirmPassword"
            {...register("confirmPassword")}
          />
          <p className={cn([errors.password?.message && "text-error"])}>
            {errors.confirmPassword?.message}
          </p>
        </>
      )}
      <div className="mt-6">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : buttonCta}
        </Button>
      </div>
    </form>
  );
}
