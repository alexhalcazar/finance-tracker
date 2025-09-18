//  Input is set to false for error, pass true to display red color
export function Input({
  error = false,
  errorMessage,
  className = "",
  id,
  ...props
}) {
  const inputClasses = `ui-input ${error ? "error" : ""} ${className}`;

  return (
    <div className="ui-form-group">
      <input id={id} className={inputClasses} {...props} />
      {error && errorMessage && (
        <span className="ui-error-message">{errorMessage}</span>
      )}
    </div>
  );
}
