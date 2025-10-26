'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { fadeIn, fadeInUp, fadeInLeft, fadeInRight, fadeInScale } from '@/styles/animations.css';

export type AnimationType = 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeInScale';

interface AnimatedImageProps extends Omit<ImageProps, 'className'> {
  className?: string;
  animationDelay?: string;
  animationType?: AnimationType;
  threshold?: number;
  rootMargin?: string;
}

const animationMap = {
  fadeIn,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  fadeInScale,
};

export default function AnimatedImage({
  className = '',
  animationDelay = '0ms',
  animationType = 'fadeIn',
  threshold = 0.1,
  rootMargin = '0px',
  ...props
}: AnimatedImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const animationClass = animationMap[animationType];

  useEffect(() => {
    const currentRef = imageRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div 
      ref={imageRef}
      className={`${animationClass} ${isVisible ? 'visible' : ''} ${className}`}
      style={{
        display: 'inline-block',
        width: '100%',
        height: '100%',
        transitionDelay: isVisible ? animationDelay : '0ms',
      }}
      aria-hidden={props.alt ? 'false' : 'true'}
    >
      <Image 
        {...props}
        onLoadingComplete={() => {
          // Force a reflow to ensure the animation plays when the image is loaded
          if (imageRef.current) {
            // This triggers the animation when the image is loaded
            imageRef.current.getBoundingClientRect();
          }
        }}
      />
    </div>
  );
}
