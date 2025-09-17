import React from "react";
import Image from "next/image";
import * as s from "./Icon.css";

export type IconSize = keyof typeof s.size; // xs|sm|md|lg|xl
export type IconTone = keyof typeof s.tone; // default|muted|primary
export type IconShape = keyof typeof s.shape; // none|rounded|pill|soft

type IconVariant =
  | "plus"
  | "minus"
  | "arrowRight"
  | "arrowLeft"
  | "arrowDown"
  | "arrowUp"
  | "globe"
  | "menu";
type IconVariantSourceMap = Record<IconVariant, string>;
const iconVariantSourceMap: IconVariantSourceMap = {
  plus: "/plus.svg",
  minus: "/minus.svg",
  arrowRight: "/arrow-right.svg",
  arrowLeft: "/arrow-left.svg",
  arrowDown: "/arrow-down.svg",
  arrowUp: "/arrow-up.svg",
  globe: "/globe.svg",
  menu: "/MenuIcon.svg",
};

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string; // supports png/jpg/svg paths in public/
  alt?: string;
  size?: IconSize;
  tone?: IconTone;
  shape?: IconShape;
  variant?: IconVariant;
  // Render an inline SVG node directly
  children?: React.ReactNode;
}

const isRaster = (src?: string) =>
  !!src && /\.(png|jpg|jpeg|webp|gif|avif)$/i.test(src);
const isSvg = (src?: string) => !!src && /\.svg$/i.test(src);

export const BaseIcon: React.FC<Omit<IconProps, "variant">> = ({
  src,
  alt,
  size = "md",
  tone = "default",
  shape = "none",
  className,
  children,
  ...rest
}) => {
  const classNames = [
    s.root,
    s.size[size],
    s.tone[tone],
    s.shape[shape],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      role={alt ? "img" : undefined}
      aria-label={alt}
      className={classNames}
      {...rest}
    >
      {children ? (
        children
      ) : src ? (
        isRaster(src) ? (
          <Image
            src={src}
            alt={alt || ""}
            width={24}
            height={24}
            style={{ width: "100%", height: "100%" }}
          />
        ) : isSvg(src) ? (
          // For svg, allow browser to render directly to inherit currentColor
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || ""}
            style={{ width: "100%", height: "100%" }}
          />
        ) : null
      ) : null}
    </span>
  );
};

export const Icon: React.FC<IconProps> = ({ variant, ...props }) => {
  return (
    <BaseIcon
      {...props}
      src={variant ? iconVariantSourceMap[variant] : props.src}
    />
  );
};
export default Icon;
