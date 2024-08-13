import { AllPurchases } from "@/components/all-purchases";
import AuthNavbar from "@/components/auth-navbar";

export default function Page(){
    return (
        <>
        <div className="flex flex-col min-h-svh bg-gray-100 text-gray-900">
            <AuthNavbar />
            <main className="flex-1 p-4 grow min-h-full">
                <AllPurchases />
            </main>
        </div>
        </>
    )
}