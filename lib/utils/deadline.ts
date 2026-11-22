import {
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  startOfDay,
} from "date-fns";
import { bn } from "date-fns/locale";
import { toBnDigits } from "./bn";

export type DeadlineUrgency =
  | "none"
  | "expired"
  | "today"
  | "soon"
  | "week"
  | "normal";

export interface DeadlineInfo {
  isValid: boolean;
  daysLeft: number | null;
  formatted: string;
  urgency: DeadlineUrgency;
  label: string;
}

export function getDeadlineInfo(
  deadline?: string | null,
  now = new Date(),
): DeadlineInfo {
  if (!deadline) {
    return {
      isValid: false,
      daysLeft: null,
      formatted: "তারিখ নেই",
      urgency: "none",
      label: "",
    };
  }

  const parsed = parseISO(deadline);
  if (!isValid(parsed)) {
    return {
      isValid: false,
      daysLeft: null,
      formatted: "তারিখ নেই",
      urgency: "none",
      label: "",
    };
  }

  const deadlineDate = startOfDay(parsed);
  const daysLeft = differenceInCalendarDays(deadlineDate, startOfDay(now));
  const formatted = toBnDigits(
    format(deadlineDate, "d MMMM yyyy", { locale: bn }),
  );

  if (daysLeft < 0) {
    return {
      isValid: true,
      daysLeft,
      formatted,
      urgency: "expired",
      label: "মেয়াদ শেষ",
    };
  }

  if (daysLeft === 0) {
    return {
      isValid: true,
      daysLeft,
      formatted,
      urgency: "today",
      label: "আজই শেষ দিন",
    };
  }

  if (daysLeft <= 3) {
    return {
      isValid: true,
      daysLeft,
      formatted,
      urgency: "soon",
      label: `${toBnDigits(daysLeft)} দিন বাকি · জরুরি`,
    };
  }

  if (daysLeft <= 7) {
    return {
      isValid: true,
      daysLeft,
      formatted,
      urgency: "week",
      label: `${toBnDigits(daysLeft)} দিন বাকি`,
    };
  }

  return {
    isValid: true,
    daysLeft,
    formatted,
    urgency: "normal",
    label: `${toBnDigits(daysLeft)} দিন বাকি`,
  };
}

type TimestampLike = { toDate: () => Date };

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as TimestampLike).toDate === "function"
  );
}

export function formatTimestamp(value: unknown): string | null {
  if (!value) return null;

  let date: Date;
  if (isTimestampLike(value)) {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else {
    return null;
  }

  if (Number.isNaN(date.getTime())) return null;

  return toBnDigits(
    format(date, "d MMMM yyyy · HH:mm", { locale: bn }),
  );
}

export function timestampToMillis(value: unknown): number | null {
  if (!value) return null;
  if (isTimestampLike(value)) return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string" || typeof value === "number") {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? null : time;
  }
  return null;
}
