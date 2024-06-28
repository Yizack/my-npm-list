declare module "#auth-utils" {
  interface User {
    ghUser: string;
    ghId: number;
  }
  interface UserSession {
    user: User;
    ghTokens: {
      access_token: string;
    };
  }
}

export {};
