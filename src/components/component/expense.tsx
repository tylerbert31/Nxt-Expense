import { Suspense } from "react";
import {
  TodayCard,
  Last7DaysCard,
  Last30DaysCard,
  CardTemplateLoader,
} from "./minified/card";
import {
  Prev30Days,
  Prev7Days,
  BarGraphTemplateLoader,
} from "./minified/bargraph";
import AddExpense from "./addExpense";
import PurchaseTable from "./minified/table_server";
import { Button } from "../ui/button";
import AuthNavbar from "../auth-navbar";
import Link from "next/link";

export async function Expense() {
  return (
    <div className="flex flex-col min-h-full bg-gray-100 text-gray-900 min-w-96">
      <AuthNavbar />
      <main className="flex-1 p-4 grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AddExpense />
          <Suspense fallback={<CardTemplateLoader />}>
            <TodayCard />
          </Suspense>
          <Suspense fallback={<CardTemplateLoader />}>
            <Last7DaysCard />
          </Suspense>
          <Suspense fallback={<CardTemplateLoader />}>
            <Last30DaysCard />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Suspense fallback={<BarGraphTemplateLoader />}>
            <Prev7Days />
          </Suspense>
          <Suspense fallback={<BarGraphTemplateLoader />}>
            <Prev30Days />
          </Suspense>
        </div>
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-2">Recent</h2>
            <Link href="/recent" prefetch={true}>
              <Button variant="link" className="!text-black">View all</Button>
            </Link>
          </div>
          <Suspense fallback={<></>}>
            <PurchaseTable />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
