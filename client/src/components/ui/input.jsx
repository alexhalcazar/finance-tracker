import { cn } from "@/utils/cn";

export function Input({
  error = false,
  errorMessage,
  className = "",
  id,
  ...props
}) {
  const inputBaseClasses =
    "px-4 py-3 border rounded-lg text-base transition-all duration-200 outline-none w-full" +
    " border-muted bg-white text-muted placeholder-muted";

  const inputFocusClasses =
    "focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/20";

  const inputDisabledStyles =
    "disabled:bg-muted disabled:text-secondary-foreground disabled:cursor-not-allowed disabled:border-muted";

  const inputErrorStyles = "focus:border-red-500 focus:ring-error/20";

  const finalInputClasses = cn(
    inputBaseClasses,
    inputFocusClasses,
    inputDisabledStyles,
    error && [inputErrorStyles],
    className
  );

  return (
    <div className="space-y-1">
      <input id={id} className={finalInputClasses} {...props} />
      {error && errorMessage && (
        <span className="text-sm text-error block">{errorMessage}</span>
      )}
    </div>
  );
}
