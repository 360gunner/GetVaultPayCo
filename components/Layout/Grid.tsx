import React from "react";
import * as s from "./Grid.css";

export type GridGap = keyof typeof s.gap; // none|xs|sm|md|lg|xl

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | string; // e.g., 3 or "repeat(3, 1fr)" or responsive via CSS
  minColWidth?: number | string; // if provided, uses auto-fit minmax(minColWidth, 1fr)
  gap?: GridGap;
}

export const Grid: React.FC<GridProps> = ({
  columns,
  minColWidth,
  gap = "md",
  style,
  className,
  children,
  ...rest
}) => {
  const styles: React.CSSProperties = {
    gridTemplateColumns: minColWidth
      ? `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`
      : typeof columns === "number"
      ? `repeat(${columns}, minmax(0, 1fr))`
      : columns,
    ...style,
  };
  return (
    <div
      className={[s.root, s.gap[gap], className].filter(Boolean).join(" ")}
      style={styles}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Grid;
