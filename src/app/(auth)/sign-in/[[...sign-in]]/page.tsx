"use client";
import { PublicNavbar } from "@/components/public-navbar";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex flex-col min-h-svh auth_div">
      <PublicNavbar signIn={false} signUp={true} />
      <div className="grid place-items-center grow">
        <SignIn />
      </div>
    </main>
  );
}
