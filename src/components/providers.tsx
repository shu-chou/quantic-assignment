/**
 * Providers component: wraps the application with necessary providers for state management and authentication.
 *
 * This component provides the following providers:
 *  - SessionProvider: manages user sessions using NextAuth
 *  - Provider: manages global state using Redux
 *
 * Props:
 *  - children: React nodes to be wrapped with the providers
 *
 * Purpose:
 *  - Enables Redux state management throughout the application
 *  - Enables NextAuth session management throughout the application
 */

"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
