import React from "react";
import * as s from "./Button.css";
import Typography, { TypographyProps } from "../Typography/Typography";
import { vars } from "@/styles/theme.css";
type ButtonVariants = "primary" | "colored" | "secondary";
export interface ButtonProps {
  style?: React.CSSProperties;
  variant?: ButtonVariants;
  backgroundColor?: string;
  paddingEqual?: boolean;
  size?: "small" | "medium" | "large";
  font?: TypographyProps["font"];
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  backgroundColor,
  paddingEqual,
  label,
  font = "Instrument Sans",
  children,
  style,
  ...props
}) => {
  const sizeClass =
    size === "small" ? s.small : size === "large" ? s.large : s.medium;
  const modeClass =
    variant === "primary"
      ? s.primary
      : variant === "colored"
      ? s.colored
      : s.secondary;
  const paddingEqualClass = paddingEqual ? s.paddingEqual : "";
  return (
    <button
      type="button"
      className={[s.button, sizeClass, modeClass, paddingEqualClass].join(" ")}
      style={{ backgroundColor, ...style }}
      {...props}
    >
      {label ? (
        <Typography as="span" margin={0} font={font}>
          {label}
        </Typography>
      ) : typeof children === "string" ? (
        <Typography as="span" margin={0} font={font}>
          {children}
        </Typography>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
