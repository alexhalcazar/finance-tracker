## Overview

Each folder is separated to run the client and server in different instances, for example
you may only run the server when you need to make changes only on the server while the client is independent.

Benefits of this setup.

- node_modules plus other packages that are meant for server only will not be in the client and vice-versa
- Each folder can be deployed on different services
  - Allows for reliability if the server goes down, it won't rely on client and vice-versa
  - Independent running services

**Tip**

> In development, you may run both the server and client independently by running each server and client instance on two different terminal shells

## Installing Node Modules

### How to Install Node Packages on Client Folder

Before trying to run each project independently, navigate to the client project and install the node packages via npm.

```bash
cd client
npm install
```

> `node_modules`folder are ignored in the `client/.gitignore` when using git

### How to Install Node Packages on Server Folder

Next on the server folder, navigate to it using the terminal then install the node packages via npm.

```bash
cd server
npm install
```

### How to run the server

On the project directory, after cloning this repository, you may enter the following to run the server:

```bash
cd server
npm run dev
```

Now go to https://localhost:8080 to view the backend such as navigating to api routes with the latter localhost to view endpoints.

### How to run the client

On another terminal window you may enter the following to run the client

```bash
cd client
npm run dev
```

Now go to https://localhost:3030 to view the front end which is React.js using Vite and React router.


## Authentication Utilities

We use [bcryptjs](https://www.npmjs.com/package/bcryptjs) in the backend for password security.

- Passwords are never stored in plain text.  
- Each password is **hashed with a unique salt** before being saved in the database.  
- Login attempts are verified by comparing the plain password with the stored hash.

### Hashing Functions

Defined in `server/src/utils/hash.js`:

- `hashPassword(plain)` -> hashes a plain-text password (returns a bcrypt hash string).  
- `verifyPassword(plain, hashed)` -> verifies a plain password against a stored hash.  

### Configuration

The bcrypt cost factor (number of salt rounds) can be configured via environment variables:

```env
# .env
BCRYPT_ROUNDS=12

