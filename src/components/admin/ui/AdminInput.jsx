/**
 * Styled Solid Admin Input Control
 */
export default function AdminInput({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  id,
  name,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6f6f76] pointer-events-none">
          <Icon size={16} />
        </div>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full min-h-[44px] rounded-xl bg-[#111113] border border-[#262628] text-[#f2f2f2] text-xs sm:text-sm placeholder-[#6f6f76] focus:outline-hidden focus:border-[#e90c47] focus:ring-1 focus:ring-[#e90c47]/40 disabled:opacity-50 disabled:cursor-not-allowed transition font-sans ${
          Icon ? "pl-10 pr-3.5" : "px-3.5"
        } py-2.5 ${className}`}
        {...props}
      />
    </div>
  );
}
