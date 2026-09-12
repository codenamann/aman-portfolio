/**
 * Reusable Form Field Container
 * Provides consistent label, description/help text, required mark, and error rendering.
 */
export default function AdminFormField({
  label,
  description,
  error,
  required = false,
  children,
  className = "",
  id,
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-[#f2f2f2] font-sans"
        >
          {label} {required && <span className="text-[#e90c47]">*</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-[11px] text-[#a1a1a6] leading-normal">
          {description}
        </p>
      )}
      {error && (
        <p className="text-[11px] text-rose-400 font-medium leading-normal">
          {error}
        </p>
      )}
    </div>
  );
}
