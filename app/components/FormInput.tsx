import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({
  label,
  error,
  value,
  className,
  style,
  ...props
}: FormInputProps) {
  const inputId = props.id || `input-${label.replace(/\s+/g, "-")}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={inputId} className="text-label">
        {label}
      </label>
      <input
        {...props}
        id={inputId}
        value={value || ""}
        className={className || "w-full border-input text-xs"}
        aria-invalid={!!error}
        aria-describedby={errorId}
        style={style}
      />
      {error && (
        <span id={errorId} className="text-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
