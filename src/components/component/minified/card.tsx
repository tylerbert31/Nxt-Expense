import React from "react";
import { Today, PastWeek, PastMonth } from "@/lib/model/pocketbase";
import numeral from "numeral";
import { unstable_noStore as noCache } from "next/cache";

const CardTemplate = ({
  caption,
  value,
}: {
  caption: string;
  value: string | number;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-2">{caption}</h2>
      <p className="text-4xl font-bold">₱ {value}</p>
    </div>
  );
};

const TodayCard = async () => {
  noCache();
  const today = await Today.findToday();
  const caption: string = "Today";
  return (
    <CardTemplate
      caption={caption}
      value={today ? numeral(today).format("0.0a") : 0}
    />
  );
};

const Last7DaysCard = async () => {
  const pastweek = await PastWeek.getToday();
  const caption: string = "Last 7 Days";
  return (
    <CardTemplate
      caption={caption}
      value={numeral(pastweek?.total_expenses ?? 0).format("0.00a")}
    />
  );
};

const Last30DaysCard = async () => {
  const pastmonth = await PastMonth.getToday();
  const caption: string = "Last 30 Days";
  return (
    <CardTemplate
      caption={caption}
      value={numeral(pastmonth?.total_expenses ?? 0).format("0.00a")}
    />
  );
};

const CardTemplateLoader = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 animate-pulse">
      <h2 className="text-lg font-bold mb-2 bg-gray-300 w-1/2 h-4"></h2>
      <p className="text-4xl font-bold bg-gray-300 w-1/2 h-8"></p>
    </div>
  );
};

export { TodayCard, Last7DaysCard, Last30DaysCard, CardTemplateLoader };
