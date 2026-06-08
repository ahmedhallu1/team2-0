/** Minimal className joiner — filters out falsy values. */
export function clsx(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
