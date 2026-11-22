const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBnDigits(value: string | number): string {
  return String(value).replace(
    /[0-9]/g,
    (digit) => BENGALI_DIGITS[Number(digit)],
  );
}

export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return "শুভ রাত্রি";
  if (hour < 12) return "শুভ সকাল";
  if (hour < 16) return "শুভ দুপুর";
  if (hour < 19) return "শুভ বিকেল";
  return "শুভ সন্ধ্যা";
}
