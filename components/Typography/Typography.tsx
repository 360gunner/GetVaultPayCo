import React from "react";
import { base, asStyles, fontStyles } from "./Typography.css";

export type TypographyAs = keyof typeof asStyles; // 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
export type TypographyFont = keyof typeof fontStyles; // 'Space Grotesk' | 'Instrument Sans'

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: TypographyAs;
  font?: TypographyFont;
  weight?: React.CSSProperties["fontWeight"];
  align?: React.CSSProperties["textAlign"];
  color?: React.CSSProperties["color"];
  margin?: React.CSSProperties["margin"];
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  as = "p",
  font = "Instrument Sans",
  weight,
  align,
  color,
  className,
  style,
  margin,
  children,
  ...rest
}) => {
  const Tag = as as any;
  const classes = [base, asStyles[as], fontStyles[font], className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag
      className={classes}
      style={{ fontWeight: weight, textAlign: align, color, margin, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Typography;
