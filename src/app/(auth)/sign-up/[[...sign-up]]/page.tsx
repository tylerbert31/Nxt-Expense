"use client";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid place-items-center min-h-svh">
      <SignUp />
    </div>
  );
}
