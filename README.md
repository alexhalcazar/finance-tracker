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
