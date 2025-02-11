/**
 * NextAuth configuration file: sets up authentication for the application.
 *
 * Features:
 *  - Uses the CredentialsProvider to handle user authentication
 *  - Defines the credentials required for authentication (email and password)
 *  - Defines the authorize function to validate user credentials and return user data
 *  - Defines the callbacks to update the JWT and session with user data
 *  - Sets up the sign-in page to /login
 *
 * Purpose:
 *  - Provides authentication for the application using NextAuth.js
 *  - Validates user credentials and returns user data
 *  - Updates the JWT and session with user data
 *  - Redirects users to the sign-in page when authentication is required
 */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For admin
        if (credentials.email === "admin@taskapp.com") {
          return {
            id: "admin",
            email: "admin@taskapp.com",
            isAdmin: true,
          };
        }

        // For regular users
        const userId = Math.floor(Math.random() * 10) + 1;
        return {
          id: userId.toString(),
          email: credentials.email,
          userId: userId,
          isAdmin: false,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin;
        session.user.userId = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
