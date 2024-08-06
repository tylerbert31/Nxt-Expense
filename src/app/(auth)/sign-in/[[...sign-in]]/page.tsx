"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="grid place-items-center min-h-svh auth_div">
      <SignIn />
    </main>
  );
}
