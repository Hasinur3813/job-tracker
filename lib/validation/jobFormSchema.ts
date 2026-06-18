import * as z from "zod";
import { parseISO, isValid } from "date-fns";
import { JobDocument } from "@/lib/hooks/useJobs";
import { JobStatusType } from "@/lib/constants/statusConfig";

const POSITION_NUMBER_REGEX = /^[0-9\u09E6-\u09EF]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const jobStatusValues = [
  "not_applied",
  "applied",
  "skipped",
  "given_exam",
  "passed",
  "failed",
  "interviewed",
] as const satisfies readonly JobStatusType[];

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidDateString(value: string): boolean {
  if (!DATE_REGEX.test(value)) return false;
  const parsed = parseISO(value);
  return isValid(parsed);
}

export const jobFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "চাকরির পদের নাম আবশ্যক")
    .max(200, "নাম ২০০ অক্ষরের বেশি হতে পারবে না"),
  organisation: z
    .string()
    .trim()
    .min(1, "প্রতিষ্ঠানের নাম আবশ্যক")
    .max(200, "প্রতিষ্ঠানের নাম ২০০ অক্ষরের বেশি হতে পারবে না"),
  position_number: z
    .string()
    .trim()
    .max(20, "পদ সংখ্যা ২০ অক্ষরের বেশি হতে পারবে না")
    .refine(
      (val) => val === "" || POSITION_NUMBER_REGEX.test(val),
      "শুধুমাত্র সংখ্যা দিন (যেমন: ০১ বা ৫)",
    ),
  category: z.enum(["govt", "non-govt"], {
    message: "আবেদনের বিভাগ নির্বাচন করুন",
  }),
  deadline: z
    .string()
    .min(1, "আবেদনের শেষ তারিখ আবশ্যক")
    .refine(isValidDateString, "সঠিক তারিখ নির্বাচন করুন"),
  status: z.enum(jobStatusValues, {
    message: "আবেদনের অবস্থা নির্বাচন করুন",
  }),
  source_url: z
    .string()
    .trim()
    .max(500, "লিংক ৫০০ অক্ষরের বেশি হতে পারবে না")
    .refine(
      (val) => val === "" || isValidHttpUrl(val),
      "সঠিক লিংক প্রদান করুন (যেমন: https://example.com)",
    ),
  salary_range: z
    .string()
    .trim()
    .max(100, "বেতনের তথ্য ১০০ অক্ষরের বেশি হতে পারবে না"),
  notes: z
    .string()
    .trim()
    .max(2000, "নোট ২০০০ অক্ষরের বেশি হতে পারবে না"),
  credentials: z.object({
    username: z
      .string()
      .trim()
      .max(100, "ইউজারনেম ১০০ অক্ষরের বেশি হতে পারবে না"),
    password: z
      .string()
      .trim()
      .max(100, "পাসওয়ার্ড ১০০ অক্ষরের বেশি হতে পারবে না"),
  }),
});

export type JobFormInput = z.infer<typeof jobFormSchema>;

export const jobFormDefaultValues: JobFormInput = {
  title: "",
  organisation: "",
  position_number: "",
  category: "non-govt",
  deadline: "",
  status: "not_applied",
  source_url: "",
  salary_range: "",
  notes: "",
  credentials: {
    username: "",
    password: "",
  },
};

export function toJobPayload(data: JobFormInput): Omit<JobDocument, "id"> {
  const payload: Omit<JobDocument, "id"> = {
    title: data.title,
    organisation: data.organisation,
    position_number: data.position_number || "",
    category: data.category,
    deadline: data.deadline,
    status: data.status,
    source_url: data.source_url || "",
    salary_range: data.salary_range || "",
    notes: data.notes || "",
    credentials: {
      username: "",
      password: "",
    },
  };

  if (data.category === "govt") {
    payload.credentials = {
      username: data.credentials.username || "",
      password: data.credentials.password || "",
    };
  }

  return payload;
}

export function jobDocumentToFormInput(
  data: Omit<JobDocument, "id">,
): JobFormInput {
  return {
    title: data.title ?? "",
    organisation: data.organisation ?? "",
    position_number: data.position_number ?? "",
    category: data.category ?? "non-govt",
    deadline: data.deadline ?? "",
    status: data.status ?? "not_applied",
    source_url: data.source_url ?? "",
    salary_range: data.salary_range ?? "",
    notes: data.notes ?? "",
    credentials: {
      username: data.credentials?.username ?? "",
      password: data.credentials?.password ?? "",
    },
  };
}
