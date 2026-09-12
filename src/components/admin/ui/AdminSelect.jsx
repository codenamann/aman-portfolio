import { ChevronDown } from "lucide-react";

/**
 * Styled Admin Select Dropdown Control
 * Provides consistent dark minimalist styling, focus ring, and custom chevron indicator.
 */
export default function AdminSelect({
  value,
  onChange,
  options = [],
  disabled = false,
  required = false,
  id,
  name,
  className = "",
  children,
  ...props
}) {
  return (
    <div className="relative w-full">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full min-h-[44px] pl-3.5 pr-9 py-2.5 rounded-xl bg-[#111113] border border-[#262628] text-[#f2f2f2] text-xs sm:text-sm focus:outline-hidden focus:border-[#e90c47] focus:ring-1 focus:ring-[#e90c47]/40 disabled:opacity-50 disabled:cursor-not-allowed transition appearance-none cursor-pointer font-sans ${className}`}
        {...props}
      >
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#151517] text-[#f2f2f2] py-1">
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6f6f76]">
        <ChevronDown size={15} />
      </div>
    </div>
  );
}
