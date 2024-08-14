import { AllPurchases } from "@/components/all-purchases";
import AuthNavbar from "@/components/auth-navbar";
import { Expenses } from "@/lib/model/pocketbase";
import { ExpenseResults, Query, TypeGet, TypeResults } from "@/lib/types";
import { format } from "date-fns";

export default async function Page({ searchParams }: { searchParams: Query }) {

    const GET: TypeGet = {
        description: searchParams.description ?? null,
        category: searchParams.category ? Number(searchParams.category) : 11,
        amountMin: searchParams.amountMin ? Number(searchParams.amountMin) : null,
        amountMax: searchParams.amountMax ? Number(searchParams.amountMax) : null,
        date: searchParams.date ?? null,
        perPage: searchParams.perPage ? Number(searchParams.perPage) : 10,
        page: searchParams.page ? Number(searchParams.page) : 1,
    }

    const data: TypeResults = await Expenses.findMyExpenses(GET.page, GET.perPage, GET);
    const results: ExpenseResults[] = data.items.map((item) => {
        return {
            id: item.id,
            amount: item.amount,
            description: item.description,
            category: item.category,
            customCreatedAt: format(item.customCreatedAt, 'PP'),
        }
    });

    const { items, ...pagination } = data;

    return (
        <>
        <div className="flex flex-col min-h-svh bg-gray-100 text-gray-900">
            <AuthNavbar />
            <main className="flex-1 p-4 grow min-h-full">
                <AllPurchases items={results} pagination={pagination} />
            </main>
        </div>
        </>
    )
}