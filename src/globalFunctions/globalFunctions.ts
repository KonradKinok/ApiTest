import toast from "react-hot-toast";


export function displayErrorMessage(componentName: string, functionName: string, error: unknown, isToast: boolean = true) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(
    `%c[ERROR]%c [${componentName}] [${functionName}]\n%c${errorMessage}`,
    "color: rgb(255, 255, 255); background: rgb(255, 0, 0); ",
    "color: rgb(255, 255, 0); font-weight: bold; ",
    "color: rgb(224, 255, 255); font-style: italic;"
  );
  if (isToast) {
    toast.error(`${errorMessage}`);
  }
}
// Get the path names from a patch name
export function getPathNames(pathname: string): string[] {
  const pathParts = pathname
    .split("/")
    .filter(Boolean)
    .map((part) => `/${part}`);
  return pathParts;
}




//moveKind: auto, smooth, instant
export function upScreen(moveKind: ScrollBehavior = "smooth") {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : moveKind,
  });
};

//Pobierz nazwy pól obiektów
export function typedKeys<T extends object>(object: T): Array<keyof T> {
  return Object.keys(object) as Array<keyof T>;
}



const plnCurrencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

const dateOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};


export function isNumberString(
  value: string | null | undefined,
): boolean {
  return (
    value != null &&
    value.trim() !== "" &&
    Number.isFinite(Number(value))
  );
}

export function formatCurrency(
  amount: number | null | undefined,
): string {
  if (amount == null || !Number.isFinite(amount)) {
    return "";
  }

  return plnCurrencyFormatter.format(amount);
}

export function currencyFormater(value: string | number | null | undefined, maximumFractionDigits: number = 4): string {
  const currencyFormatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: maximumFractionDigits, // Maksymalna liczba cyfr po przecinku
  });

  if (value === null || value === undefined) {
    return currencyFormatter.format(0);
  }

  const num =
    typeof value === "number" ? value : parseFloat(value.replace(",", "."));

  if (isNaN(num)) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(num);
}

export function formatDate(date: Date | null): string {
  return date?.toLocaleDateString("pl-PL", dateOptions) ?? "- - -";
}

export function getWeekDay(date: Date | null, weekday: Intl.DateTimeFormatOptions["weekday"] = "long"): string {
  return date?.toLocaleDateString("pl-PL", { weekday }) ?? "";
}

export function localDateWithWeekDay(date: Date | null): string {
  if (!date || !Number.isFinite(date.getTime())) {
    return "- - -";
  }
  const stringDate = `${formatDate(date)}r. ${getWeekDay(date)}`;
  return stringDate;
}

// Funkcja do poprawnej polskiej deklinacji słowa
const pluralRules = new Intl.PluralRules("pl-PL");
export function pluralizeWord(count: number, word: "dzień" | "tydzień" | "miesiąc" | "rok",): string {
  let declination: Record<string, string>;
  switch (word) {
    case "dzień":
      declination = {
        one: "dzień",
        few: "dni",
        many: "dni",
        other: "dnia",
      }
      break;
    case "tydzień":
      declination = {
        one: "tydzień",
        few: "tygodnie",
        many: "tygodni",
        other: "tygodnia",
      }
      break;
    case "miesiąc":
      declination = {
        one: "miesiąc",
        few: "miesiące",
        many: "miesięcy",
        other: "miesięca",
      };
      break;
    case "rok":
      declination = {
        one: "rok",
        few: "lata",
        many: "lat",
        other: "roku",
      };
      break;
  }
  const rule = pluralRules.select(count);
  return `${count} ${declination[rule]}`;
};

//Pierwsza wielka litera
export const capitalizeFirstLetter = (str: string): string => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
};
// <pre>Wynik: { JSON.stringify(przyklad1a, null, 2) } </pre>
