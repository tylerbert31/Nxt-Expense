import AppModel, { pb } from "./app_model";
import Days from "./date";

interface DateExp {
  name: string;
  count: number;
}

class TodayModel extends AppModel {
  async getToday() {
    return await this.findOne();
  }

  async sumWithDate(date: string): Promise<number> {
    const wholeDay = await this.findAll({
      filter: `created ~ '${date}'`,
      fields: "amount",
    });

    if (wholeDay.length) {
      const total = wholeDay.reduce((acc, item) => acc + item.amount, 0);
      return total as number;
    } else {
      return 0;
    }
  }

  async sumThisWeek() {
    const dates = Days.daysLastWeek();
    const dateExp: DateExp[] = [] as DateExp[];

    const total = await Promise.all(
      dates.map(async (date) => {
        dateExp.unshift({
          name: date.date_formatted,
          count: await this.sumWithDate(date.date),
        });
      })
    );
    return dateExp.sort((a, b) => (a.name < b.name ? 1 : -1));
  }

  async sumPastWeeks() {
    const WeeksCondition = Days.lastNumWeeks(5);
    const dateExp = await Promise.all(
      WeeksCondition.map(async (condition) => {
        return await this.findAll({
          filter: condition,
          sort: "-created",
        });
      })
    );
    const sum: DateExp[] = [] as DateExp[];
    dateExp.forEach((week, i) => {
      const total = week.reduce((acc, item) => acc + item.amount, 0);
      sum.push({ name: `${i + 1}`, count: total });
    });
    return sum;
  }
}

const Today = new TodayModel("expense_today");
const ThisWeek = new TodayModel("expense_week");
const ThisMonth = new TodayModel("expense_month");
const PastWeek = new TodayModel("expense_past_7d");
const PastMonth = new TodayModel("expense_past_30d");
const Expenses = new TodayModel("expenses");

export { Today, ThisWeek, ThisMonth, PastWeek, PastMonth, Expenses };
