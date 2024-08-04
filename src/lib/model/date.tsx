import { getISOWeek, startOfWeek, addDays, format } from "date-fns";

const daysNum = [0, 1, 2, 3, 4, 5, 6];

class Days {
  daysLastWeek(pastWeek: number = 1) {
    const currentDate = new Date();
    const startOfLastWeek = new Date(
      currentDate.getTime() - 7 * pastWeek * 24 * 60 * 60 * 1000
    ); // Subtract 7 days from current date

    const dates = [...daysNum].map((i) => addDays(startOfLastWeek, i));
    const formattedDates = dates.map((date) => ({
      day: format(date, "EEEE"), // 'EEEE' gives the full day name (Monday, Tuesday, etc.)
      date_formatted: format(date, "MMM dd"),
      date: format(date, "yyyy-MM-dd"),
    }));

    return formattedDates;
  }

  daysThisWeek(week: number = 1) {
    const currentDate = new Date();
    const startOfThisWeek = startOfWeek(currentDate); // Start of current week (Sunday)
    const startOfRequestedWeek = addDays(startOfThisWeek, -7 * week); // Subtract requested number of weeks

    const dates = [...daysNum].map((i) => addDays(startOfRequestedWeek, i));
    const formattedDates = dates.map((date) => ({
      day: format(date, "EEEE"), // 'EEEE' gives the full day name (Monday, Tuesday, etc.)
      date_formatted: format(date, "MMM dd"),
      date: format(date, "yyyy-MM-dd"),
    }));
    return formattedDates;
  }

  lastNumWeeks(num: number = 4): string[] {
    const weeksNum: number[] = Array.from({ length: num }, (_, i) => i + 1);
    const week: string[][] = [];
    weeksNum.forEach((weekNum) => {
      const daysThisWeek = this.daysThisWeek(weekNum);
      week[weekNum - 1] = daysThisWeek.map((day) => day.date);
    });

    const condition_formatted: string[] = week.map((week) => {
      return `created ~ '${week.join("' || created ~ '")}'`;
    });

    return condition_formatted;
  }
}

export default new Days();
