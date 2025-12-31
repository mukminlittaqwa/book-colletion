declare module "#auth-utils" {
  interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  }

  interface UserSession {
    loggedInAt?: Date;
  }
}

export {};
