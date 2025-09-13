## Overview

Minimal overview of the react client application, to run the application read the root directory README.md

### Eslint Config Setup

Ignores the dist directory.

- ESLint prevents from checking build output files, as they are outputted they can be changed over time.

### Extends in EsLint Config

`extends` keyword is extending rules on what is the minimal configuration.

- JavaScript recommended rules (js.configs.recommended)
  - Provides basic JavaScript linting rules such as catching syntax errors, unused variables, etc.
  - Will stop only at build time
- React Hooks rules (reactHooks.configs['recommended-latest'])
  - Enforces React Hooks best practices
  - Hooks are called in the same order and only at top level of components.
- React Refresh rules (reactRefresh.configs.vite)
  - Ensures components are compatible with Vite's hot module replacement (HMR) for fast development feedback

### Language Configuration

Language Configuration:

- ECMAScript 2020+ support with latest features enabled
- Browser globals available (like window, document, etc.)
- JSX parsing enabled for React components
- ES modules support for import/export statements
  - i.e. `import express from "express";`

## Client Project Directory Overview

Read more about the client directory here:
[Project Directory with Vite Projects](https://www.thatsoftwaredude.com/content/14110/creating-a-good-folder-structure-for-your-vite-app),

```text
├── README.md
├── client/
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── package-lock.json
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── Card.jsx
│   │   │       ├── button.jsx
│   │   │       ├── input.jsx
│   │   │       └── label.jsx
│   │   ├── features/
│   │   │   └── auth/
│   │   │       └── AuthForm.jsx
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── router/
│   │   │   └── routes.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── utils/
│   │       └── cn.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/
```

### Client Project Directory Tips

After reading the article in the previous section,
please try to follow a similar or closely coupled directory structure as it will help minimize stack traces and be able to have one close standard everyone follows.

## Client File Aliases

When importing file and functions the imports will be relative to the current file path, however if a refactor such as moving the file elsewhere will become a mess down the line.

For example, take a look at the the following:

```jsx
import { Card } from "././ui/Card";
```

The above will have to be manually updated with periods to denote the new path if it is moved in the future.

There is one new file introduced being the `vite.config.js` and the updated `jsconfig.json`.

In both files, there is an `@` to denote the path where you will want to start and trace to that file path where the `src` folder is the parent `@` path.

```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@router": path.resolve(__dirname, "./src/router"),
      /* if we want to add a 'hooks' folder underneath source then we will add the following example below*/
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
});
```

## Styling

### TailwindCSS

Learn more about TailwindCSS by heading [to their official site](https://tailwindcss.com/).

#### TailwindCSS Colors

Using the @theme attribute, you can create and create custom theme colors
within the `globals.css`, below we have our colors that we can access.

```css
@import "tailwindcss";

:root {
  --primary-color: #125eaf;
  --primary-foreground-color: #ffffff;
  --secondary-color: #4e575f;
  --secondary-foreground-color: #ffffff;
  --text-color: #1a1a1a;
  --text-muted-color: #4e575f;
  --error-color: #ef4444;
  --primary-bg: #125eaf;
  --secondary-bg: #374151;
  --white-bg: white;
  --accent-color: #e5e7eb;
  --white-color: #d1d5db;
}

@theme {
  --color-primary: var(--primary-color);
  --color-primary-foreground: var(--primary-foreground-color);
  --color-secondary: var(--secondary-color);
  --color-secondary-foreground: var(--secondary-foreground-color);
  --color-muted: var(--text-muted-color);
}
```

Next in our inline class utility functions if you want to access the color primary then you can go ahead and do something like this in the markup.

```jsx
{
  /* primary text color denoted from --color-primary */
}
<p className="text-primary">I am the primary text color</p>;
{
  /* secondary text color denoted from --color-primary */
}
<p className="text-secondary">I am the primary text color</p>;
```

```jsx
{
  /* primary background color denoted from --color-primary */
}
<div className="bg-primary">I am the primary text color</div>;
{
  /* secondary background color denoted from --color-secondary*/
}
<div className="bg-secondary">I am the primary text color</div>;
```

#### Adding TailwindCSS Colors

Now, if you want to add a `error` color, you can

```css
:root {
  /* ...previous colors */
  --error-color: #FF00000;
}

@theme {
  /* ...previous colors */
  --color-error: var(--error-color);
}
```

You can then grab that red error color in your className utility classes below as they are now available to your theme.

```jsx
{
  /* error background color denoted from --color-error */
}
<div className="bg-error">I am the primary text color</div>;
{
  /* error text color denoted from --color-error*/
}
<p className="text-error">I am the primary text color</p>;
```

Here are some helpful guides found describing TailwindCSS V4 theme.

- [Stack Overflow Custom Color Themes Discussion](https://stackoverflow.com/questions/79499818/how-to-use-custom-color-themes-in-tailwindcss-v4)
- [Custom Colors in TailwindCSS V4](https://medium.com/@dvasquez.422/custom-colours-in-tailwind-css-v4-acc3322cd2da)

### UI Components

#### Class Utility Function

```javascript
// found in utils/cn.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

The above snippet merges all Tailwind utility classes that are from the official taiwlindcss classes as well as merging custom class names using the [clsx library](https://www.npmjs.com/package/clsx).

Merge all class names to one long class name to your markup, below is an example where the following occurs.

- When error prop is set to true, it will add the `inputErrorStyles` class names which will make the span red
- `baseClasses`is always applied to the span element
- the parent `className` prop is added so we can always add additional TailwindCSS utility classes

```jsx
export function Span({ error = false, text = " ", className }) {
  const baseClasses = "px-4 py-3 border rounded-lg text-base transition-all";

  const errorStyles = "focus:border-red-500 focus:ring-error/20";

  const finalClassNames = cn(
    baseClasses,
    error && [inputErrorStyles],
    className
  );

  return <span className={finalClassNames}>{text}</span>;
}
```

If we want to let's say make the font bold to the custom Span component, we can simply do the following.

```jsx
import { Span } from "@/components/ui/Span";
function OtherComponent() {
  return (
    <div>
      <h1>I am a Heading</h1>
      <Span className="font-bold" error={true}>
        Bolded Error
      </Span>
    </div>
  );
}
```

Now there is a bold font on the custom span class by simply passing in that `className` property as well as we applied those error red styling by passing in `true`.

## Routing With React Router

Read more about react routing with routes, in data mode, by heading to [Routing Docs here](https://reactrouter.com/start/data/routing)

### Routing in this Project

We have our routing located in our `src/router/routes.js` where we have left the index path of `/`to be our main App.jsx component.

Our current authentication login and register pages are seen as below.

```javascript
import { createBrowserRouter } from "react-router";
import App from "@/App";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";

const router = createBrowserRouter([
  {
    children: [
      { index: true, Component: App },
      {
        path: "auth",
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
    ],
  },
]);
export default router;
```

The paths will looks like this below.

- `/` shows the App.jsx component
- `/auth/login`shows Login component
- `/auth/register`shows Register component

### Routing Initialized in Main.jsx

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import router from "@/router/routes";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
```

Above we are passing in the router config we exported from our `src/router/routes` where we are using the RouterProvider. Please refer to the official data mode react router docs for more information, but essentially it is loading up the routes from the routes config we have set up.

## Features

### Authentication Overview

We pass in the form object from the library of [react-hook-form](https://www.react-hook-form.com/get-started/) that handles creating and registering our validation with the validation library [Zod](https://zod.dev/).

From either the form or login pages, we pass down to the auth form component where we handle registering the form schema controllers and error display.

#### Form Schema

We pass in the form schema properties from the `z.object` we defined in the `features/auth/formSchema.js`where we write our own properties we need to look like on the form and use the zod objects to define what the properties are supposed to look like.

For example in the `loginSchema` for the login page, we have the email and password fields associated with the user and pass in what they type they should be and pass in the error message it should return if the patterns are a **mismatch.**

```javascript
const loginSchema = z.object({
  email: z.email({
    pattern: z.regexes.html5Email,
    error: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters in length." }),
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((form) => form.password === form.confirmPassword, {
    message: "Password's do not match",
    path: ["confirmPassword"],
  });
```

#### AuthForm Component

In the `registerSchema`we extend the `loginSchema` zod object by adding a confirmPassword field where we further refine to check if the current form `password`will match the `confirmPassword` property, then we give the message to that new field path if the password's do not match.

The authentication form, `AuthForm.jsx` is a reusable component for both the `Login`and `Register` pages/routes.

Below we are destructuring the passed in form object, where it got initiated in either the parent component of the login or register pages, and grabbing the errors the form can have which is available thanks to our form schema from `formSchema.js`

```javascript
//  Grab the parent form object passed from parent component, destructure their properties
const {
  register,
  handleSubmit,
  formState: { errors },
} = form;
```

To register, let's take for example the login route, we pass in the register we want to match to the form schema so below we are registering the input to the "email" attribute and react-hook-form will handle linking.

```javascript
<Input
  type="email"
  placeholder="Enter your email"
  id="email"
  {...register("email")}
/>
<p className={cn([errors.email?.message && "text-error"])}>{errors.email?.message}
</p>
```

Notice we destructured the errors from the formState which keeps track of the state of the current form, therefore we used our cn utility function to pass in a _text-error_ tailwind class to add in a shade of red color when we do have an error from the user, finally we will display the errors of that email message which we had set up in our formSchema.js and the text rendered will be below when the user does not match a standard email string.

```javascript
const loginSchema = z.object({
  email: z.email({
    pattern: z.regexes.html5Email,
    error: "Please enter a valid email",
  }),
});
```

The above error message we have inserted in the loginSchema for the email attribute will get rendered to the below markup when the user enters an invalid format that does not match an email.

```jsx
<p className={cn([errors.email?.message && "text-error"])}>
  {errors.email?.message}
</p>
```

Finally in the parent component, below is the register comopnent, we will initiate the form object from [react-hook-form](https://www.react-hook-form.com/) where we pass in our [zod](https://zod.dev/) schema, using a zod resolver to bind the schema to the stateful form object, and we insert default values that are used on page load.

```javascript
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
```

On the submit function, this is where we can grab the login data that was used on the form and it will output the below to be used to be able to login or connect the endpoint to the backend to login as well as adding additional functionality such as a session token of the logged in user.

```json
{
  "email": "test@gmail.com",
  "password": "testPassword",
  "confirmPassword": "testPassword;"
}
```
