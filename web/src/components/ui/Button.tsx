import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`bg-slate-100 border rounded-lg border-black hover:bg-slate-300 text-black font-regular py-2 px-4 m-2 ${props.className}`}
    >
      {children}
    </button>
  );
};
