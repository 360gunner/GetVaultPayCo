"use client";

import React, { useRef, useEffect, useState, ReactNode } from "react";

export type FadeInVariant = "default" | "up" | "scale";

type ElementTag = "div" | "section" | "article" | "span" | "main" | "aside" | "header" | "footer" | "nav" | "ul" | "li";

export interface FadeInProps {
  children: ReactNode;
  variant?: FadeInVariant;
  delay?: number; // delay in ms
  duration?: number; // duration in ms
  threshold?: number; // IntersectionObserver threshold (0-1)
  triggerOnce?: boolean; // only animate once
  className?: string;
  style?: React.CSSProperties;
  as?: ElementTag;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  variant = "default",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  triggerOnce = true,
  className = "",
  style = {},
  as: Component = "div",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasAnimated(true);
            observer.unobserve(element);
          }
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, triggerOnce, hasAnimated]);

  // Get transform based on variant
  const getInitialTransform = () => {
    switch (variant) {
      case "up":
        return "translateY(30px)";
      case "scale":
        return "scale(0.95)";
      default:
        return "translateY(15px)";
    }
  };

  const combinedStyle: React.CSSProperties = {
    ...style,
    opacity: hasAnimated ? 1 : (isVisible ? 1 : 0),
    transform: hasAnimated ? "none" : (isVisible ? "none" : getInitialTransform()),
    transition: isVisible || hasAnimated 
      ? `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`
      : "none",
  };

  return React.createElement(
    Component,
    {
      ref,
      className: className,
      style: combinedStyle,
    },
    children
  );
};

export default FadeIn;
