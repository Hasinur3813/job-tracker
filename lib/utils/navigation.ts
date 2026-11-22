export const DEFAULT_AUTH_REDIRECT = "/dashboard";

const SAFE_BASE = "https://app.local";

export function getSafeNextPath(
  value: string | null | undefined,
): string {
  if (!value || !value.startsWith("/")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  try {
    const target = new URL(value, SAFE_BASE);
    if (target.origin !== SAFE_BASE) {
      return DEFAULT_AUTH_REDIRECT;
    }
    if (target.pathname === "/auth" || target.pathname.startsWith("/auth/")) {
      return DEFAULT_AUTH_REDIRECT;
    }
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return DEFAULT_AUTH_REDIRECT;
  }
}
