import { Expense } from "@/components/component/expense";
import { Homepage } from "@/components/homepage";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <SignedIn>
        <Expense />
      </SignedIn>
      <SignedOut>
        <Homepage />
      </SignedOut>
    </>
  );
}
