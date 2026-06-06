// Shared sanitize/format helpers for numeric text inputs (AppNumberInput +
// FormNumberInput) — one source of truth for "digits + one decimal, capped
// fractional places, optional minus, thousand separators".

// sanitizeNumber parses raw user input into a canonical numeric string:
// strips commas, blocks non-digits, enforces a single decimal point, caps
// decimal places, and respects allowNegative.
export function sanitizeNumber(
  raw: string,
  allowNegative: boolean,
  decimals: number,
): string {
  if (raw === "") return "";

  let s = raw.replace(/,/g, "");

  let sign = "";
  if (allowNegative && s.startsWith("-")) {
    sign = "-";
    s = s.slice(1);
  }

  let seenDot = false;
  let cleaned = "";
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      cleaned += ch;
    } else if (ch === "." && !seenDot && decimals > 0) {
      cleaned += ".";
      seenDot = true;
    }
  }

  if (cleaned.includes(".")) {
    const [intPart, fracPart = ""] = cleaned.split(".");
    cleaned = intPart + "." + fracPart.slice(0, decimals);
  }

  return sign + cleaned;
}

// formatNumber renders a sanitized numeric string with thousand separators on
// the integer part, preserving a trailing "." and fractional zeros while the
// user is mid-typing.
export function formatNumber(value: string): string {
  if (value === "" || value === "-") return value;

  const negative = value.startsWith("-");
  const body = negative ? value.slice(1) : value;
  const [intPart, fracPart] = body.split(".");
  const intFmt = intPart === "" ? "" : Number(intPart).toLocaleString("en-US");

  let out = intFmt;
  if (body.includes(".")) {
    out += "." + (fracPart ?? "");
  }
  return negative ? "-" + out : out;
}
