'use client'
import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface AnimationProps {
  children: ReactNode;
  direction: 'left' | 'right' | 'top' | 'bottom';
}

const Animation: React.FC<AnimationProps> = ({ children, direction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const getTransformValue = () => {
    const initialTranslate = isVisible ? '0%' : '10%';
    switch (direction) {
      case 'left':
        return `translateX(-${initialTranslate})`;
      case 'right':
        return `translateX(${initialTranslate})`;
      case 'top':
        return `translateY(-${initialTranslate})`;
      case 'bottom':
        return `translateY(${initialTranslate})`;
      default:
        return `translate(${initialTranslate})`;
    }
  };

  const style: React.CSSProperties = {
    transition: 'opacity 0.5s, transform 0.5s',
    opacity: isVisible ? 1 : 0,
    transform: getTransformValue(),
    position: 'relative',
  };

  return (
    <div className='animation' ref={elementRef} style={style}>
      {children}
    </div>
  );
};

export default Animation;
