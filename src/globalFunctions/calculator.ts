import type { CalculationResult, DayEntry, DayKind, InputData, PunishmentRules, PunishmentRuleSet } from "../../types/globalTypes";
import { formatCurrency } from "./globalFunctions";



export const punishmentRules = {
  bought: [
    {
      effectiveFrom: new Date(2024, 0, 1),
      rules: {
        otherOwner: [
          { stage: "first", deadline: 30, amount: 500 },
          { stage: "second", deadline: 180, amount: 1000 },
        ],
        vehicleTrader: [
          { stage: "first", deadline: 90, amount: 1000 },
          { stage: "second", deadline: 180, amount: 2000 },
        ],
      },
    },
  ],

  inheritance: [
    {
      effectiveFrom: new Date(2024, 0, 1),
      rules: {
        otherOwner: [
          { stage: "first", deadline: 30, amount: 500 },
          { stage: "second", deadline: 180, amount: 1000 },
        ],
        vehicleTrader: [
          { stage: "first", deadline: 30, amount: 500 },
          { stage: "second", deadline: 180, amount: 1000 },
        ],
      },
    },
    {
      effectiveFrom: new Date(2025, 11, 25),
      rules: {
        otherOwner: [
          { stage: "first", deadline: 60, amount: 500 },
          { stage: "second", deadline: 180, amount: 1000 },
        ],
        vehicleTrader: [
          { stage: "first", deadline: 60, amount: 500 },
          { stage: "second", deadline: 180, amount: 1000 },
        ],
      },
    },
  ],

  sold: [
    {
      effectiveFrom: new Date(2024, 0, 1),
      rules: {
        otherOwner: [
          { stage: "first", deadline: 30, amount: 250 },
        ],
        vehicleTrader: [
          { stage: "first", deadline: 30, amount: 250 },
        ],
      },
    },
    {
      effectiveFrom: new Date(2026, 11, 1),
      rules: {
        otherOwner: [
          { stage: "first", deadline: 30, amount: 500 },
        ],
        vehicleTrader: [
          { stage: "first", deadline: 30, amount: 500 },
        ],
      },
    },
  ],
} as const satisfies PunishmentRules;

function getPunishmentRules(
  selection: InputData,
): PunishmentRuleSet {
  const selectedTime = selection.selectedDate.getTime();

  if (Number.isNaN(selectedTime)) {
    throw new Error("Nieprawidłowa data zdarzenia");
  }

  const versions =
    punishmentRules[selection.typeOfEvent];

  const applicableVersion = versions.findLast(
    (version) =>
      version.effectiveFrom.getTime() <= selectedTime,
  );

  if (!applicableVersion) {
    throw new Error(
      `Brak reguł dla zdarzenia "${selection.typeOfEvent}" i podanej daty`,
    );
  }

  return applicableVersion.rules[
    selection.typeOfPerson
  ];
}


export function calculationNumberOfDays(
  inputData: InputData,
): CalculationResult {

  const listOfDays: DayEntry[] = []


  const startDate = new Date(inputData.selectedDate);

  if (Number.isNaN(startDate.getTime())) {
    throw new Error("Nieprawidłowa data początkowa");
  }

  // Tablica jedno- lub dwuelementowa z regułami obliczania kary
  const baseData = getPunishmentRules(inputData)

  const firstCase = baseData[0];
  const secondCase = baseData[1];
  const firstPenaltyTerm = firstCase.deadline;
  const secondPenaltyTerm = secondCase?.deadline;
  const firstPenaltyAmount = firstCase.amount;
  const secondPenaltyAmount = secondCase?.amount;
  const penaltyTerm = secondPenaltyTerm ?? firstPenaltyTerm;
  let secondPenalty = false;
  let nextDayOfTheDeadlineNumber = 0;
  let nextDay = 0;
  do {
    const newDate = new Date(startDate); // Kopiujemy datę początkową
    newDate.setDate(startDate.getDate() + nextDay); // Dodajemy odpowiednią liczbę dni
    const currentDay = new Date(newDate); // Tworzymy nowy obiekt daty (skopiowany)

    if (nextDayOfTheDeadlineNumber === firstPenaltyTerm || nextDayOfTheDeadlineNumber === secondPenaltyTerm) {
      if (isHoliday(currentDay)) {
        const description = "dzień wolny";

        listOfDays.push({
          kind: "nonWorkingDay",
          nextDayNumber: nextDay,
          nextDayDate: currentDay,
          nextDayOfTheDeadlineNumber: null, // Numerowanie dni
          punishmentNextDate: null,
          description: description,
          iconName: "Calendar",
        });
        nextDay++;
        continue;
      }
      const description = "ostatni termin";

      listOfDays.push({
        kind: "lastDay",
        nextDayNumber: nextDay,
        nextDayDate: currentDay,
        nextDayOfTheDeadlineNumber: nextDayOfTheDeadlineNumber, // Numerowanie dni
        punishmentNextDate: currentDay,
        description: description,
        iconName: "Calendar",
      });
      nextDayOfTheDeadlineNumber++;
      nextDay++;
      continue;
    }
    if (nextDayOfTheDeadlineNumber === firstPenaltyTerm + 1 || secondPenaltyTerm && nextDayOfTheDeadlineNumber === secondPenaltyTerm + 1) {
      const amount = nextDayOfTheDeadlineNumber === firstPenaltyTerm + 1 ? firstPenaltyAmount : secondPenaltyAmount
      const description = formatCurrency(amount);

      listOfDays.push({
        kind: "penalty",
        nextDayNumber: nextDay,
        nextDayDate: currentDay,
        nextDayOfTheDeadlineNumber: nextDayOfTheDeadlineNumber, // Numerowanie dni
        punishmentNextDate: currentDay,
        description: description,
        iconName: "Calendar",
      });

      secondPenalty = true;
      nextDay++;
      nextDayOfTheDeadlineNumber = nextDay;

      continue;
    }

    let description;
    let kind: DayKind;
    if (nextDayOfTheDeadlineNumber === 0) {
      description = "data początkowa";
      kind = "start";
    }
    else {
      description = !secondPenalty
        ? "dzień terminu I"
        : `dzień terminu II`;
      kind = "regularDay";
    }

    listOfDays.push({
      kind: kind,
      nextDayNumber: nextDay,
      nextDayDate: currentDay,
      nextDayOfTheDeadlineNumber: nextDayOfTheDeadlineNumber, // Numerowanie dni
      punishmentNextDate: currentDay,
      description: description,
      iconName: "Calendar",
    });

    nextDayOfTheDeadlineNumber++;
    nextDay++;

  } while (nextDayOfTheDeadlineNumber < penaltyTerm + 2);

  return { listOfDays }; // Zwracamy obiekt z listą dat 

}

export function isHoliday(dayOff: Date): boolean {
  // Sprawdza dni wolne w tygodniu
  if (dayOff.getDay() === 6) return true; // Sobota
  if (dayOff.getDay() === 0) return true; // Niedziela

  // Sprawdza stałe daty świąt
  if (dayOff.getMonth() === 0 && dayOff.getDate() === 1) return true; // Nowy Rok
  if (dayOff.getMonth() === 0 && dayOff.getDate() === 6) return true; // Trzech Króli
  if (dayOff.getMonth() === 4 && dayOff.getDate() === 1) return true; // 1 maja
  if (dayOff.getMonth() === 4 && dayOff.getDate() === 3) return true; // 3 maja
  if (dayOff.getMonth() === 7 && dayOff.getDate() === 15) return true; // Wniebowzięcie NMP / Święto Wojska Polskiego
  if (dayOff.getMonth() === 10 && dayOff.getDate() === 1) return true; // Wszystkich Świętych
  if (dayOff.getMonth() === 10 && dayOff.getDate() === 11) return true; // Święto Niepodległości
  if (dayOff.getFullYear() >= 2025 && dayOff.getMonth() === 11 && dayOff.getDate() === 24) return true; // Wigilia (od 2025 roku)
  if (dayOff.getMonth() === 11 && dayOff.getDate() === 25) return true; // Boże Narodzenie (pierwszy dzień)
  if (dayOff.getMonth() === 11 && dayOff.getDate() === 26) return true; // Boże Narodzenie (drugi dzień)

  // Oblicza datę Wielkanocy (algorytm Gaussa)
  const year = dayOff.getFullYear();
  const a = year % 19;
  const b = year % 4;
  const c = year % 7;
  let d = (a * 19 + 24) % 30;
  const e = (2 * b + 4 * c + 6 * d + 5) % 7;

  // Korekcje
  if (d === 29 && e === 6) d -= 7;
  if (d === 28 && e === 6 && a > 10) d -= 7;

  // Wyznacza datę Wielkanocy (niedziela)
  const easter = new Date(year, 2, 22); // 22 marca
  easter.setDate(easter.getDate() + d + e);

  // Święta ruchome
  const easterMonday = new Date(easter);
  easterMonday.setDate(easterMonday.getDate() + 1); // Poniedziałek Wielkanocny

  const corpusChristi = new Date(easter);
  corpusChristi.setDate(corpusChristi.getDate() + 60); // Boże Ciało (60 dni po Wielkanocy)

  if (dayOff.toDateString() === easter.toDateString()) return true; // Wielkanoc (niedziela)
  if (dayOff.toDateString() === easterMonday.toDateString()) return true; // Poniedziałek Wielkanocny
  if (dayOff.toDateString() === corpusChristi.toDateString()) return true; // Boże Ciało

  return false; // Nie jest dniem wolnym
}

export function checkFunctionIsHoliday() {
  const bozeCialo = new Date(2025, 5, 19)
  const poniedzialekWielkanocny = new Date(2025, 3, 21)
  console.log(`Boże Ciało ${bozeCialo}`, isHoliday(bozeCialo)); // 19.06.2025 → Boże Ciało 2025 → true
  console.log(`Poniedziałek Wielkanocny ${poniedzialekWielkanocny}`, isHoliday(poniedzialekWielkanocny)); // Poniedziałek Wielkanocny 2025 → true
}


