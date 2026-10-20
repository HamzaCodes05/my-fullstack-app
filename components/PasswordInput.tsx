"use client";

import { useState, type ComponentProps } from "react";

// className styles the wrapper (margins); the input itself is fixed.
export default function PasswordInput({
  className = "",
  ...props
}: Omit<ComponentProps<"input">, "type">) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      <input
        {...props}
        type={show ? "text" : "password"}
        className="w-full rounded border border-[#075f42]/20 py-2 pl-3 pr-10 text-gray-900 outline-none transition focus:border-[#d89c34] focus:ring-2 focus:ring-[#d89c34]/25"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-[#075f42]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
          {show && <path d="M3 3l18 18" />}
        </svg>
      </button>
    </div>
  );
}
