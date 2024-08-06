import AppModel, { pb } from "./app_model";
import Days from "./date";

interface DateExp {
  name: string;
  amount: number;
}

class TodayModel extends AppModel {

  /**
   * Get the sum of expenses for Date
   * @param date '2024-07-31'
   * @returns 
   */
  async sumWithDate(date: string): Promise<number> {
    const { startTime, endTime } = this.getDateBreakdown(date);
    const sum = await this.sumBetween(String(startTime), String(endTime));
    return sum ?? 0;
  }


  /**
   * Gets the sum of expenses each day for the last 7 days
   * @returns {Promise<DateExp[]>}
   */
  async sumThisWeek(): Promise<DateExp[]> {
    const dates = Days.daysLastWeek();
    const dateExp: DateExp[] = [] as DateExp[];

    await Promise.all(
      dates.map(async (date) => {
        dateExp.unshift({
          name: date.date_formatted,
          amount: await this.sumWithDate(date.date),
        });
      })
    );
    return dateExp.sort((a, b) => (a.name < b.name ? 1 : -1));
  }

  /**
   * Get the sum of expenses for the last n weeks
   * @returns {Promise<DateExp[]>}
   */
  async sumPastWeeks(): Promise<DateExp[]> {
    const startEndWeeks = Days.getWeekStartEnd(5);

    const dateExp = await Promise.all(
      startEndWeeks.map(async (week, i) => {
        const start = this.getDateBreakdown(week[0]);
        const end = this.getDateBreakdown(week[1]);
        const sum = await this.sumBetween(String(start.startTime), String(end.endTime));
        return {name: String(i+1), amount: sum ?? 0};
      }
    ));

    return dateExp;
  }
}

const Today = new TodayModel("expense_today");
const Expenses = new TodayModel("expenses");

export { Today, Expenses };
