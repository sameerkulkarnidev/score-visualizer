import React from "react";
import cns from "classnames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * variant to style the buttons appropriately
   */
  variant?: "primary" | "text";
}

/**
 * A button component to apply common styles across all buttons
 * @param props {Props} - button props
 * @returns {JSX} - button jsx
 */
const Button = (props: Props) => {
  const { className, children, variant, ...rest } = props;

  return (
    <button
      className={cns(
        "px-3 py-2",
        "hover:opacity-80",
        {
          "bg-indigo-600 text-white": variant === "primary",
          "border border-gray-500 rounded": variant !== "text",
          "bg-white hover:bg-indigo-600 hover:text-white":
            variant !== "primary" && variant !== "text",
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
