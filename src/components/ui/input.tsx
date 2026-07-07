import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, className, ...props },
  ref
) {
  if (!icon) {
    return <input ref={ref} className={`campo-input ${className ?? ""}`.trim()} {...props} />;
  }
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">
        {icon}
      </span>
      <input ref={ref} className={`campo-input pl-9 ${className ?? ""}`.trim()} {...props} />
    </div>
  );
});
