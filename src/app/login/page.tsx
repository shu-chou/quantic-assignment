/**
 * LoginPage component: a page for users to log in to the application.
 *
 * Features:
 *  - Uses the NextAuth.js library to handle user authentication
 *  - Uses the Sonner library to display notifications
 *  - Uses the Next.js router to redirect users after successful login
 *  - Uses the React useState hook to manage the loading state of the login form
 *  - Uses the React useRouter hook to get the current router object
 *  - Uses the React useEffect hook to refresh the router after successful login
 *  - Renders a card with a form for users to enter their email and password
 *  - Renders a button to submit the form and initiate the login process
 *  - Displays error messages if the login credentials are invalid or if something goes wrong
 *
 * Purpose:
 *  - Provides a page for users to log in to the application
 *  - Handles the login process using NextAuth.js
 *  - Displays error messages if something goes wrong
 *  - Redirects users to the home page after successful login
 */

"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login to Task App</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input name="email" type="email" placeholder="Email" required />
            </div>
            <div className="space-y-2">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
