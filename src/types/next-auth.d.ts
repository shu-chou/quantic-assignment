import "next-auth";

declare module "next-auth" {
  interface User {
    isAdmin?: boolean;
    userId?: number;
  }

  interface Session {
    user: {
      isAdmin?: boolean;
      userId?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
    userId?: number;
  }
}
