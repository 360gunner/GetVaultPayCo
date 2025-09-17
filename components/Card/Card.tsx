import React from "react";
import * as s from "./Card.css";

export type CardVariant = keyof typeof s.variant; // plain|elevated|outline

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "plain",
  interactive = false,
  className,
  header,
  footer,
  children,
  ...rest
}) => {
  const classes = [s.root, s.variant[variant], interactive && s.interactive, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {header ? <div className={s.header}>{header}</div> : null}
      <div>{children}</div>
      {footer ? <div className={s.footer}>{footer}</div> : null}
    </div>
  );
};

export default Card;
