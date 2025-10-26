'use client';

import { useEffect } from 'react';

export function ImageAnimationWrapper() {
  useEffect(() => {
    // Add animation styles to all images
    const style = document.createElement('style');
    style.textContent = `
      img {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 2.0s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 2.0s cubic-bezier(0.16, 1, 0.3, 1);
      }
      /* Exclusions */
      img.no-fade, .no-fade img {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
      
      img.animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);

    // Function to animate images when they come into view
    const animateImages = () => {
      const images = document.querySelectorAll('img:not(.animate-in):not(.no-fade)');
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      images.forEach((img) => {
        observer.observe(img);
      });

      // Cleanup function
      return () => {
        images.forEach((img) => {
          observer.unobserve(img);
        });
      };
    };

    // Initial animation
    const cleanup = animateImages();

    // Watch for dynamically added images
    const mutationObserver = new MutationObserver(() => {
      animateImages();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      cleanup?.();
      mutationObserver.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
