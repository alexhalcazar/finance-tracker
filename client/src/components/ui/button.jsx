export function Button({
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}) {
  const buttonClasses = `ui-button ${variant} ${
    size !== "default" ? size : ""
  } ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
