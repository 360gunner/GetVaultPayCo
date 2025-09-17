import React from "react";
import * as s from "./Stack.css";

export type StackGap = keyof typeof s.gap; // none|xs|sm|md|lg|xl
export type StackAlign = keyof typeof s.align; // start|center|end|stretch
export type StackJustify = keyof typeof s.justify; // start|center|end|between

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
}

export const Stack: React.FC<StackProps> = ({ gap = "md", align = "stretch", justify = "start", className, children, ...rest }) => {
  const classes = [s.root, s.gap[gap], s.align[align], s.justify[justify], className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export default Stack;
