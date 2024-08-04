"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid place-items-center min-h-svh">
      <SignIn />
    </div>
  );
}
