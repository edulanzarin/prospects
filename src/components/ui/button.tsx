import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export type ButtonVariant =
  | "primary"
  | "primary-navy"
  | "success"
  | "danger"
  | "outline"
  | "outline-danger"
  | "ghost";

export type ButtonSize = "sm" | "md";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:opacity-88",
  "primary-navy": "bg-ink text-ink-contrast hover:bg-ink-hover",
  success: "bg-cliente-fg text-white hover:opacity-88",
  danger: "bg-alerta-bg text-alerta-fg hover:opacity-80",
  outline:
    "border border-input-border bg-card text-text hover:bg-primary-soft",
  "outline-danger":
    "border border-input-border bg-card text-text-muted hover:border-transparent hover:bg-alerta-bg hover:text-alerta-fg",
  ghost: "text-primary hover:text-primary-hover",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = ""
) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-[10px] transition-[opacity,background-color,border-color,color] disabled:opacity-60 whitespace-nowrap";

  if (variant === "ghost") {
    return `${base} text-xs font-medium ${VARIANT_CLASSES.ghost} ${className}`.trim();
  }
  return `${base} font-medium ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`.trim();
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, disabled, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.15 }}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
});
