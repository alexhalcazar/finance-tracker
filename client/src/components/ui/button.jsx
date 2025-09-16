import { cn } from "@/utils/cn";

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}) {
  /**
   * baseClasses are the base styling classes that shape the button while the variants add coloring and hover behaviors.
   */
  const baseClasses =
    "inline-flex items-center justify-center rounded-md" +
    " font-medium transition-colors focus-visible:outline-none focus-visible:ring-2" +
    " focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" +
    " hover:cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/70 active:bg-primary/80 active:translate-y-px",
    secondary:
      "bg-secondary text-secondary-foreground border border-accent hover:border-accent/90",
    outline:
      "bg-transparent text-muted border border-muted hover:border-muted/70",
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    default: "px-6 py-2 text-base",
    large: "px-8 py-4 text-lg",
  };

  //  create the final "class" to be added to the button using the key passed in to apply the passed property
  const finalButtonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  return (
    <button className={finalButtonClasses} {...props}>
      {children}
    </button>
  );
}
