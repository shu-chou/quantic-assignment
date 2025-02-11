/**
 * Sidebar component: displays a navigation menu with links to different pages.
 *
 * Features:
 *  - Dynamic link generation based on user role (admin or non-admin)
 *  - Active link highlighting based on current URL
 *  - Logout button with redirect to login page
 *
 * Uses:
 *  - NextAuth for user session management
 *  - Next Navigation for getting current URL
 *  - UI components (Button, Link) for rendering the menu
 *
 * Props:
 *  - None
 *
 * Purpose:
 *  - Provides a navigation menu for the application
 *  - Handles user logout and redirect to login page
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

const getLinks = (isAdmin: boolean) => {
  const baseLinks = [
    { href: "/", label: "All Tasks" },
    { href: "/active", label: "Active Tasks" },
  ];

  if (!isAdmin) {
    baseLinks.push({ href: "/add", label: "Add Task" });
  }

  return baseLinks;
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const links = getLinks(isAdmin ?? false);

  return (
    <aside className="w-64 h-screen bg-gray-100 p-4">
      <nav className="space-y-2">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === href && "bg-gray-200"
              )}
            >
              {label}
            </Button>
          </Link>
        ))}
        <Button
          variant="destructive"
          className="w-full mt-4"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </Button>
      </nav>
    </aside>
  );
}
