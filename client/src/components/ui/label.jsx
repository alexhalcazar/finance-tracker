import { cn } from "@/utils/cn";

export function Label({ htmlFor, className, children, ...props }) {
  const labelClasses = cn("block text-base font-medium mb-1", className);

  return (
    <label htmlFor={htmlFor} className={labelClasses} {...props}>
      {children}
    </label>
  );
}
