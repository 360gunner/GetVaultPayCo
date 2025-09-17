import React from "react";
import * as s from "./Container.css";

export type ContainerSize = keyof typeof s.size; // sm|md|lg|xl|full

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export const Container: React.FC<ContainerProps> = ({ size = "lg", className, children, ...rest }) => {
  const classes = [s.root, s.size[size], className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export default Container;
