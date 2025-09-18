import { cn } from "@/utils/cn";

export function Card({ children, className = "" }) {
  return (
    <div
      className={cn("rounded-lg shadow-lg border border-muted p-6", className)}
    >
      {children}
    </div>
  );
}
