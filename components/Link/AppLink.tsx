import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import * as s from "./AppLink.css";

export type LinkVariant = keyof typeof s.variant; // default|subtle|primary|button

export interface AppLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">, NextLinkProps {
  variant?: LinkVariant;
  className?: string;
}

export const AppLink: React.FC<AppLinkProps> = ({ variant = "default", className, children, ...rest }) => {
  const classes = [s.base, s.variant[variant], className].filter(Boolean).join(" ");
  return (
    <NextLink className={classes} {...rest}>
      {children}
    </NextLink>
  );
};

export default AppLink;
