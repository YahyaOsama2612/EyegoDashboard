import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  let baseClasses =
    "px-4 py-2 rounded-md font-medium transition-colors cursor-pointer";

  if (variant === "primary") {
    baseClasses += " bg-blue-600 text-white hover:bg-blue-700";
  } else if (variant === "secondary") {
    baseClasses += " bg-gray-600 text-white hover:bg-gray-700";
  } else if (variant === "outline") {
    baseClasses +=
      " border border-gray-300 bg-white text-gray-700 hover:bg-gray-50";
  }

  if (disabled) {
    baseClasses += " opacity-50 cursor-not-allowed";
  }

  return (
    <button
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export { Button };
