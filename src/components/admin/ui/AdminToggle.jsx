/**
 * Accessible Toggle Switch / Checkbox Component
 */
export default function AdminToggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 select-none cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="relative inline-flex items-center shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-[#262628] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#f2f2f2] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e90c47]" />
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs font-semibold text-[#f2f2f2]">{label}</span>
          )}
          {description && (
            <span className="text-[11px] text-[#a1a1a6] leading-normal mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
