"use client";

import React, { ButtonHTMLAttributes, forwardRef, useRef, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

type Coords = {
  x: number;
  y: number;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, children, onMouseMove, onTouchMove, onMouseLeave, ...props }, ref) => {
    
    // Eyeball State Tracking
    const [eyeCoords, setEyeCoords] = useState<Coords>({ x: 0, y: 0 });
    const localRef = useRef<HTMLElement | null>(null);

    // Merge refs
    const setRefs = (node: any) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const updateEyes = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
      if (onMouseMove && 'clientX' in e) onMouseMove(e as React.MouseEvent<HTMLButtonElement>);
      if (onTouchMove && 'touches' in e) onTouchMove(e as React.TouchEvent<HTMLButtonElement>);

      if (!localRef.current) return;
      const userEvent = "touches" in e ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent);
      
      const rect = localRef.current.getBoundingClientRect();
      const eyesCenter = {
        x: rect.left + rect.width - 24, 
        y: rect.top + rect.height / 2,
      };
      
      const cursor = { x: userEvent.clientX, y: userEvent.clientY };
      const dx = cursor.x - eyesCenter.x;
      const dy = cursor.y - eyesCenter.y;
      const angle = Math.atan2(-dy, dx) + Math.PI / 2;
      const distance = Math.min(Math.hypot(dx, dy), 200); 
      
      const x = (Math.sin(angle) * distance) / 150;
      const y = (Math.cos(angle) * distance) / 100;
      setEyeCoords({ x, y });
    };

    const resetEyes = (e: React.MouseEvent<HTMLElement>) => {
      if (onMouseLeave) onMouseLeave(e as React.MouseEvent<HTMLButtonElement>);
      setEyeCoords({ x: 0, y: 0 });
    };

    const translateX = -50 + eyeCoords.x * 50;
    const translateY = -50 + eyeCoords.y * 50;
    
    const eyeStyle: React.CSSProperties = {
      transform: `translate(${translateX}%, ${translateY}%)`,
      transition: "transform 0.1s ease-out" 
    };

    const isGhost = variant === "ghost";

    const ghostClass = cn(
      "inline-flex items-center justify-center font-sans font-bold uppercase tracking-widest text-sm",
      "border-b-2 border-transparent hover:border-secondary text-primary transition-all bg-transparent whitespace-nowrap outline-none cursor-pointer",
      className
    );

    // Exception for Ghost buttons to stay clean and flat without animations
    if (isGhost) {
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
          ref: setRefs,
          ...props,
          className: cn(ghostClass, (children as React.ReactElement<any>).props.className),
        });
      }
      return (
        <button
          ref={setRefs}
          className={ghostClass}
          {...props}
        >
          {children}
        </button>
      );
    }

    // Interactive Button Styling
    const coverVariants = {
      primary: "bg-primary text-white border-primary",
      secondary: "bg-secondary text-white border-secondary",
      outline: "bg-stone-50 border-primary text-primary",
    } as Record<string, string>;

    const sizes = {
      sm: "py-2 px-6 text-xs",
      md: "py-4 px-10 text-sm", 
      lg: "py-5 px-12 text-base",
    };

    const baseClass = cn(
      "group relative inline-flex items-center justify-center whitespace-nowrap overflow-visible font-sans font-bold",
      "rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none cursor-pointer",
      "bg-slate-950 border-[3px] border-slate-950", // Exactly forms the black base layer
      sizes[size],
      className
    );

    const innerContent = (childContent: React.ReactNode) => (
      <>
        <style>
          {`
            @keyframes cb-eye-blink {
              0%, 92%, 100% { height: 8px; }
              96% { height: 0px; }
            }
            .cb-eye {
              animation: cb-eye-blink 4s infinite;
              background-color: white;
              border-radius: 50%;
              width: 10px;
              height: 8px;
              position: relative;
              overflow: hidden;
            }
            .cb-pupil {
              background-color: #0f172a;
              border-radius: 50%;
              position: absolute;
              width: 5px;
              height: 5px;
              top: 50%;
              left: 50%;
            }
          `}
        </style>

        {/* 1. Invisible spacer dictating the exact width & height of the base button */}
        <span className="opacity-0 pointer-events-none flex items-center justify-center gap-2">
          {childContent}
        </span>

        {/* 2. Hidden eyes resting on the right side of the black track */}
        <span className="absolute right-[1rem] z-0 flex items-center justify-center gap-[3px] pointer-events-none">
          <span className="cb-eye">
            <span className="cb-pupil" style={eyeStyle}></span>
          </span>
          <span className="cb-eye">
            <span className="cb-pupil" style={eyeStyle}></span>
          </span>
        </span>

        {/* 3. The Colored Cover representing the actual button face */}
        <span 
          className={cn(
            "absolute -inset-[3px] z-10 flex w-[calc(100%+6px)] h-[calc(100%+6px)] items-center justify-center gap-2 rounded-full border-[3px]",
            "origin-[1.25em_50%] transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1.2)] pointer-events-none",
            coverVariants[variant],
            "group-hover:-rotate-[8deg] group-active:rotate-0"
          )}
        >
          {childContent}
        </span>
        
        {/* 4. Invisible hit area expander to stabilize hover and clickability */}
        <span className="absolute -inset-[12px] z-20 rounded-full" aria-hidden="true" />
      </>
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref: setRefs,
        onMouseMove: updateEyes,
        onTouchMove: updateEyes,
        onMouseLeave: resetEyes,
        ...props,
        className: cn(baseClass, (children as React.ReactElement<any>).props.className),
        children: innerContent((children as React.ReactElement<any>).props.children)
      });
    }

    return (
      <button
        ref={setRefs}
        onMouseMove={updateEyes}
        onTouchMove={updateEyes}
        onMouseLeave={resetEyes}
        className={baseClass}
        {...props}
      >
        {innerContent(children)}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
