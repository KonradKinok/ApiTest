
//Get type of value
function getType(value: unknown) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";

  return typeof value;
}

type ConsoleType = "log" | "warn" | "error" | "dir" | "table" | "assert" | "trace";
type ConsoleTypeWithoutAssert = Exclude<ConsoleType, "assert">;

const typeStyle =
  "background: yellow; color: black; padding: 2px 5px; font-weight: bold;";
const consoleStyles: Record<ConsoleType, string> = {
  log: "background: blue; color: white; padding: 4px 8px; border-radius: 4px;",
  warn: "background: orange; color: black; padding: 4px 8px; font-weight: bold;",
  error: "background: red; color: white; padding: 4px 8px; font-weight: bold;",
  dir: "background: green; color: white; padding: 4px 8px; border-radius: 4px;",
  table: "background: purple; color: white; padding: 4px 8px; border-radius: 4px;",
  assert: "background: red; color: white; padding: 4px 8px; font-weight: bold;",
  trace: "background: gray; color: white; padding: 4px 8px; border-radius: 4px;",
};

function createFormattedMessage(message: string, optionalParams: unknown[]) {
  let format = `%c${message}`;
  const formatArguments: unknown[] = [];

  optionalParams.forEach((param) => {
    format += `\n%c[${getType(param)}]%c %o`;
    formatArguments.push(typeStyle, "", param);
  });

  return { format, formatArguments };
}

// Log to console with custom styles and type information for optional parameters
export function logToConsole(
  type: "assert",
  message: string,
  condition: boolean,
  ...optionalParams: unknown[]
): void;
export function logToConsole(
  type: ConsoleTypeWithoutAssert,
  message: string,
  ...optionalParams: unknown[]
): void;
export function logToConsole(
  type: ConsoleType,
  message: string,
  ...optionalParams: unknown[]
): void {
  if (type === "dir") {
    console.log(`%c${message}`, consoleStyles.dir);

    optionalParams.forEach((param) => {
      console.log(`%c[${getType(param)}]`, typeStyle);
      console.dir(param);
    });

    return;
  }

  if (type === "table") {
    console.log(`%c${message}`, consoleStyles.table);

    optionalParams.forEach((param) => {
      console.log(`%c[${getType(param)}]`, typeStyle);
      console.table(param);
    });

    return;
  }

  if (type === "assert") {
    const [condition, ...assertParams] = optionalParams;
    const { format, formatArguments } = createFormattedMessage(
      message,
      assertParams,
    );

    console.assert(
      condition === true,
      format,
      consoleStyles.assert,
      ...formatArguments,
    );

    return;
  }

  const { format, formatArguments } = createFormattedMessage(
    message,
    optionalParams,
  );
  const args = [format, consoleStyles[type], ...formatArguments] as const;

  switch (type) {
    case "log":
      console.log(...args);
      break;
    case "warn":
      console.warn(...args);
      break;
    case "error":
      console.error(...args);
      break;
    case "trace":
      console.trace(...args);
      break;
  }
  //Przykład użycia:
  // logToConsole("dir", "Obiekt location", location);

  // logToConsole("table", "Lista pojazdów", vehicles);

  // logToConsole(
  //   "assert",
  //   "Lista pojazdów jest pusta",
  //   vehicles.length > 0,
  //   vehicles,
  // );

  // logToConsole("trace", "Wywołano NavigationSide", location);
}

// Measure the execution time of a function and log it to the console
export function timeExecution<T>(
  fn: () => T,
  label: string,
): T {
  console.time(label);

  try {
    return fn();
  } finally {
    console.timeEnd(label);
  }

  //Przykład użycia:
  // const numbers = Array.from({ length: 100_000 }, (_, index) => index);

  // timeExecution(
  //   () => numbers.filter((number) => number % 2 === 0),
  //   "Filtrowanie tablicy",
  // );
}

// Measure the execution time of an async function and log it to the console
export async function timeExecutionAsync<T>(
  fn: () => Promise<T>,
  label: string,
): Promise<T> {
  console.time(label);

  try {
    return await fn();
  } finally {
    console.timeEnd(label);
  }

  //Przykład użycia:
  // const response = await timeExecutionAsync(
  //   () => fetch("/api/vehicles"),
  //   "Pobieranie pojazdów",
  // );
  // const data = await response.json();
}
