/**
 * Standard Solid Surface Card Container for Admin Panel
 */
export default function AdminCard({
  children,
  className = "",
  elevation = 0, // 0 | 1 | 2
  padding = "normal", // "none" | "compact" | "normal" | "spacious"
  as: Component = "div",
  ...props
}) {
  const elevationStyles = {
    0: "bg-[#151517] border border-[#262628]",
    1: "bg-[#18181a] border border-[#262628] shadow-sm",
    2: "bg-[#18181a] border border-[#333338] shadow-lg",
  };

  const paddingStyles = {
    none: "",
    compact: "p-3 sm:p-4",
    normal: "p-4 sm:p-6",
    spacious: "p-6 sm:p-8",
  };

  return (
    <Component
      className={`rounded-2xl ${elevationStyles[elevation] || elevationStyles[0]} ${
        paddingStyles[padding] || paddingStyles.normal
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
