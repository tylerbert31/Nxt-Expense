"use client";
import { PublicNavbar } from "@/components/public-navbar";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex flex-col min-h-svh auth_div">
    <PublicNavbar signIn={true} signUp={false} />
    <div className="grid place-items-center grow">
      <SignUp />
    </div>
  </main>
  );
}
