export function Label({ htmlFor, className, children }) {
  return (
    <label htmlFor={htmlFor} className={`ui-label ${className}`}>
      {children}
    </label>
  );
}
