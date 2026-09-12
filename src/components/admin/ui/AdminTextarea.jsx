/**
 * Styled Solid Admin Textarea Control
 */
export default function AdminTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  required = false,
  id,
  name,
  className = "",
  ...props
}) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={`w-full rounded-xl bg-[#111113] border border-[#262628] text-[#f2f2f2] text-xs sm:text-sm placeholder-[#6f6f76] focus:outline-hidden focus:border-[#e90c47] focus:ring-1 focus:ring-[#e90c47]/40 disabled:opacity-50 disabled:cursor-not-allowed transition px-3.5 py-2.5 font-sans ${className}`}
      {...props}
    />
  );
}
