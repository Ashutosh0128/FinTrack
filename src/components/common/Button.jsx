import React from "react";

/**
 * Reusable Button component matching FinTrack dark theme design tokens.
 * Variants: 'primary', 'secondary', 'danger', 'ghost', 'icon'
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  icon: Icon,
  ...props
}) => {
  const variantClass = {
    primary: "primary-btn",
    secondary: "secondary-btn",
    danger: "danger-btn",
    ghost: "icon-button",
    icon: "icon-button"
  }[variant] || "primary-btn";

  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      type={type}
      className={`${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
};

export default Button;

