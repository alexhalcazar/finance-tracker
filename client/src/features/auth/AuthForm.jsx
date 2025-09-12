import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function AuthForm({ formType, className }) {
  //  Make text be register when passed in register, otherwise it is sign in
  const buttonCta = formType === "register" ? "Register" : "Sign In";

  return (
    <form className={className}>
      <div className="space-y-8">
        <Label htmlFor="email">Email</Label>
        <Input type="email" placeholder="Enter your email" id="email" />

        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          id="password"
        />

        {formType === "register" && (
          <>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              placeholder="Confirm your password"
              id="confirmPassword"
            />
          </>
        )}
      </div>
      <div className="mt-4">
        <Button variant="primary" type="submit">
          {buttonCta}
        </Button>
      </div>
    </form>
  );
}
