declare module "#auth-utils" {
  interface User {
    name: string;
    ghId: number;
    ghUser: string;
    bio: string | null;
    website: string | null;
    country: string | null;
    joined: number | null;
    listUpdated: number | null;
  }
  interface UserSession {
    user: User;
    ghTokens: {
      access_token: string;
    };
  }
}

export {};
