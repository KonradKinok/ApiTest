import type { TimeUnit } from "../../types/globalTypes";
import { isHoliday } from "./calculator";

type CalculationAdministrativeDatesResult = {
  startDate: Date;
  endDate: Date;
  endDatePlusOneDay: Date;
}

export function calculationAdministrativeDates(
  selectedDate: Date,
  timeAmount: number,
  timeUnit: TimeUnit,
): CalculationAdministrativeDatesResult {
  if (
    !(selectedDate instanceof Date) ||
    !Number.isFinite(selectedDate.getTime())
  ) {
    throw new Error("Nieprawidłowa data początkowa");
  }

  const startDate = new Date(selectedDate);
  startDate.setHours(0, 0, 0, 0);

  // Ta funkcja sprawdza również liczbę jednostek i poprawność wyniku.
  const endDate = endDateInTimeUnit(startDate, timeAmount, timeUnit);

  // Przesuwamy datę tak długo, jak trafiamy na dzień wolny.
  while (isHoliday(endDate)) {
    endDate.setDate(endDate.getDate() + 1);

    if (!Number.isFinite(endDate.getTime())) {
      throw new Error("Data końcowa przekracza obsługiwany zakres");
    }
  }

  // Kopiujemy dopiero ostateczną datę końcową.
  const endDatePlusOneDay = addDays(endDate, 1);

  if (!Number.isFinite(endDatePlusOneDay.getTime())) {
    throw new Error("Dzień po terminie przekracza obsługiwany zakres");
  }

  return {
    startDate,
    endDate,
    endDatePlusOneDay,
  };
}


function endDateInTimeUnit(
  date: Date,
  timeAmount: number,
  timeUnit: TimeUnit,
): Date {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    throw new Error("Nieprawidłowa data początkowa");
  }

  if (!Number.isSafeInteger(timeAmount) || timeAmount <= 0) {
    throw new Error(
      "Liczba jednostek czasu musi być dodatnią liczbą całkowitą",
    );
  }

  const unit = timeUnit.en;
  let endDate: Date;

  switch (unit) {
    case "day":
      endDate = addDays(date, timeAmount);
      break;

    case "week":
      endDate = addWeeks(date, timeAmount);
      break;

    case "month":
      endDate = addMonths(date, timeAmount);
      break;

    case "year":
      endDate = addYears(date, timeAmount);
      break;

    default:
      throw new Error("Nieobsługiwana jednostka czasu");
  }

  if (!Number.isFinite(endDate.getTime())) {
    throw new Error("Data końcowa przekracza obsługiwany zakres");
  }

  return endDate;
}

function addDays(date: Date, daysToAdd: number): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + daysToAdd);

  return result;
}

function addWeeks(date: Date, weeksToAdd: number): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + weeksToAdd * 7);

  return result;
}

function addMonths(date: Date, monthsToAdd: number): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  const originalDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + monthsToAdd);

  const lastDayOfMonth = new Date(result);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(0);

  result.setDate(
    Math.min(originalDay, lastDayOfMonth.getDate()),
  );

  return result;
}

function addYears(date: Date, yearsToAdd: number): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  const originalDay = result.getDate();

  result.setDate(1);
  result.setFullYear(result.getFullYear() + yearsToAdd);

  const lastDayOfMonth = new Date(result);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(0);

  result.setDate(
    Math.min(originalDay, lastDayOfMonth.getDate()),
  );

  return result;
}