"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface IProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 20,
  md: 28,
  lg: 36,
};

const StarIcon = (props: { filled: boolean; size: number }) => {
  const { filled, size } = props;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={filled ? "#C4A35A" : "none"}
        stroke={filled ? "#C4A35A" : "#D1D5DB"}
        strokeWidth={filled ? 0 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Rating = (props: IProps) => {
  const { value = 0, onChange, max = 5, disabled = false, size = "md" } = props;

  const [hoverValue, setHoverValue] = React.useState(0);

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const displayValue = hoverValue || value;
        const isFilled = starValue <= displayValue;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => !disabled && setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(0)}
            disabled={disabled}
            className={cn(
              "transition-transform hover:scale-110",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            )}
            aria-label={`Rate ${starValue} out of ${max}`}
          >
            <StarIcon filled={isFilled} size={sizeMap[size]} />
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
