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
import User from "./User";
import { currentUser } from "@clerk/nextjs/server";
import AddExpense from "./addExpense";
import PurchaseTable from "./minified/table_server";

export async function Expense() {
  const user = await currentUser();
  return (
    <div className="flex flex-col min-h-full bg-gray-100 text-gray-900">
      <header className="bg-white p-4 shadow flex justify-between">
        <h1 className="text-2xl font-bold">🤑 My Expenses</h1>
        <User />
      </header>
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
          <h2 className="text-lg font-bold mb-2">Recent</h2>
          <PurchaseTable />
        </div>
      </main>
    </div>
  );
}
