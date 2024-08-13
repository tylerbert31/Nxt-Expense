import React from "react";
import { Today, Expenses } from "@/lib/model/pocketbase";
import numeral from "numeral";
import { unstable_noStore as noCache } from "next/cache";
import { format } from "date-fns";

const CardTemplate = ({
  caption,
  value,
  previous,
}: {
  caption: string;
  value: string | number;
  previous?: string | number;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-2">{caption}</h2>
      <h1 className="text-4xl font-bold">₱ {value}</h1>
      {previous && (
        <p className="text-xs text-muted-foreground text-gray-500">{previous}</p>
      )}
    </div>
  );
};

const TodayCard = async () => {
  noCache();
  const today = await Today.sumToday();
  const caption: string = "Today";

  const dateYesterday = new Date();
  dateYesterday.setDate(dateYesterday.getDate() - 1);
  
  const yesterday: number = await Today.sumToday(format(dateYesterday, "yyyy-MM-dd")) ?? 0;
  const diff: number = (today / (yesterday ?? 1)) * 100;
  const diffPercent: number = Math.round(diff);

  const previous = yesterday > 0 ? `${diffPercent}% difference from yesterday` : undefined;
  
  return (
    <CardTemplate
      caption={caption}
      value={today ? numeral(today).format("0.0a") : 0}
      previous={previous}
    />
  );
};

const Last7DaysCard = async () => {
  const pastweek = await Expenses.sum7Days();
  const average = pastweek / 7;
  const caption: string = "Last 7 Days";
  return (
    <CardTemplate
      caption={caption}
      value={numeral(pastweek ?? 0).format("0.00a")}
      previous={`${numeral(average).format("0.00a")} daily average`}
    />
  );
};

const Last30DaysCard = async () => {
  const pastmonth = await Expenses.sum30Days();
  const caption: string = "Last 30 Days";
  const weekly = pastmonth / 4;

  return (
    <CardTemplate
      caption={caption}
      value={numeral(pastmonth ?? 0).format("0.00a")}
      previous={`${numeral(weekly).format("0.00a")} weekly average`}
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
