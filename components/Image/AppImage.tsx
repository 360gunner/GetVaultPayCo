'use client';

import React from "react";
import { ImageProps } from "next/image";
import * as s from "./AppImage.css";
import AnimatedImage, { AnimationType } from "./AnimatedImage";

export type ImageShape = keyof typeof s.shape; // square|rounded|circle

export type AppImageProps = Omit<ImageProps, "className"> &
  React.HTMLAttributes<HTMLDivElement> & {
    shape?: ImageShape;
    wrapperClassName?: string;
    animationDelay?: string;
    animationType?: AnimationType;
    threshold?: number;
    rootMargin?: string;
  };

export const AppImage: React.FC<AppImageProps> = ({
  shape = "rounded",
  wrapperClassName,
  alt = "",
  width,
  height,
  animationDelay = '0ms',
  animationType = 'fadeIn',
  threshold = 0.1,
  rootMargin = '0px',
  ...imgProps
}) => {
  const wrapper = [s.root, s.shape[shape], wrapperClassName]
    .filter(Boolean)
    .join(" ");
  const { className, ...rest } = imgProps as any;
  
  return (
    <div 
      className={wrapper} 
      style={{ 
        width, 
        height, 
        overflow: 'hidden',
        minHeight: typeof height === 'number' ? `${height}px` : height,
        minWidth: typeof width === 'number' ? `${width}px` : width,
      }}
    >
      <AnimatedImage
        {...(rest as ImageProps)}
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover",
          ...rest.style,
        }}
        alt={alt}
        width={width}
        height={height}
        animationDelay={animationDelay}
        animationType={animationType}
        threshold={threshold}
        rootMargin={rootMargin}
      />
    </div>
  );
};

export default AppImage;
