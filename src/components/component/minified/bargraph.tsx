import React from "react";
import BarChart from "../barchart";
import { Expenses } from "@/lib/model/pocketbase";

const BarGraphTemplate = ({
  caption,
  data,
}: {
  caption: string;
  data: any[];
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-2">{caption}</h2>
      <BarChart expense={data} className="aspect-[16/9]" />
    </div>
  );
};

const BarGraphTemplateLoader = () => {
  return (
    <div className="bg-white flex flex-row gap-4 justify-around rounded-lg shadow p-4 min-w-40 min-h-36"></div>
  );
};

const Prev7Days = async () => {
  const thisWeek = await Expenses.sumThisWeek();
  return <BarGraphTemplate caption="Previous 7 Days" data={thisWeek} />;
};

const Prev30Days = async () => {
  const pastWeeks = await Expenses.sumPastWeeks();
  return <BarGraphTemplate caption="Previous 5 Weeks" data={pastWeeks} />;
};

export { Prev7Days, Prev30Days, BarGraphTemplateLoader };
