/**
 * AuthLayout component: a layout component that wraps the application and checks for user authentication.
 *
 * Features:
 *  - Uses the NextAuth.js library to check the user's authentication status
 *  - Redirects unauthenticated users to the login page
 *  - Displays a loading message while the authentication status is being checked
 *  - Renders the Sidebar component and the main content area
 *
 * Purpose:
 *  - Provides a layout component that checks for user authentication and redirects unauthenticated users
 *  - Wraps the application and provides a consistent layout for authenticated users
 */

"use client";

import { Sidebar } from "@/components/sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
