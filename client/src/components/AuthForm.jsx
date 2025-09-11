import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Label } from "./ui/label";

export function AuthForm({ className }) {
  return (
    <form className={className}>
      <div className="field-group">
        <Label htmlFor="email">Email</Label>
        <Input type="email" placeholder="Enter your email" id="email" />
      </div>

      <div className="field-group">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          id="password"
        />
      </div>

      <div className="button-group">
        <Button variant="primary" type="submit">
          Sign In
        </Button>

        <Link to="/">
          <Button variant="secondary">Cancel</Button>
        </Link>
      </div>
    </form>
  );
}
