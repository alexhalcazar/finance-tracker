import { z } from "zod";

const loginSchema = z.object({
  // the regex used by browsers to validate input[type=email] fields
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
  email: z.email({
    pattern: z.regexes.html5Email,
    error: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters in length." }),
});

/**
 * Extend the login schema, pass in a default error message to ensure
 * confirmPassword is equal to the form.password which is available with extend.
 */
const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((form) => form.password === form.confirmPassword, {
    message: "Password's do not match",
    path: ["confirmPassword"],
  });

export { loginSchema, registerSchema };
