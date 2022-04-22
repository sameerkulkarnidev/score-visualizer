import React from "react";
import cns from "classnames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * A button component to apply common styles across all buttons
 * @param props {Props} - button props
 * @returns {JSX} - button jsx
 */
const Button = (props: Props) => {
  const { className, children, ...rest } = props;

  return (
    <button
      className={cns(
        "border border-gray-500 rounded px-3 py-2 bg-white",
        "hover:opacity-80 hover:bg-indigo-400 hover:text-white",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
