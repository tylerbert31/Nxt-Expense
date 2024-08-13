import Link from "next/link";
import User from "./component/User";

export default function AuthNavbar(){
    return (
        <>
            <header className="bg-white p-4 shadow flex justify-between">
                <Link href="/" className="text-2xl font-bold">🤑 My Expenses</Link>
                <User />
            </header>
        </>
    )
}