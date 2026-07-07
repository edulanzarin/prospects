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
  primary: "bg-gold text-navy hover:bg-gold-hover",
  "primary-navy": "bg-navy text-white hover:bg-navy-hover",
  success: "bg-cliente-fg text-white hover:bg-[#186b40]",
  danger: "bg-alerta-fg text-white hover:bg-[#a8311f]",
  outline:
    "border border-input-border bg-white text-text-secondary hover:border-gold hover:text-link",
  "outline-danger":
    "border border-input-border bg-white text-text-muted hover:border-alerta-fg hover:text-alerta-fg",
  ghost: "text-link hover:text-gold",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-4 py-2.5 text-[13px]",
};

const VARIANTES_SOLIDAS: ButtonVariant[] = ["primary", "primary-navy", "success", "danger"];

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = ""
) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-xl transition-colors disabled:opacity-60 whitespace-nowrap";

  if (variant === "ghost") {
    return `${base} text-xs font-semibold ${VARIANT_CLASSES.ghost} ${className}`.trim();
  }
  return `${base} font-bold ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`.trim();
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, disabled, ...props },
  ref
) {
  const solido = VARIANTES_SOLIDAS.includes(variant);
  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      whileHover={!disabled && solido ? { y: -1, boxShadow: "0 4px 12px rgba(16,24,40,0.14)" } : undefined}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      transition={{ duration: 0.15 }}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
});
