import Image from "next/image";
import { defaultQuote } from "@/data/quote";

/**
 * Renders the author / person attribution block.
 * Adapts based on whether an avatar, role, or company is present.
 */
function QuoteAttribution({ author, role, company, avatar }) {
  if (!author) return null;

  // Build subtitle from role and company if provided
  let subtitle = "";
  if (role && company) {
    subtitle =
      role.toLowerCase().includes("of") || role.toLowerCase().includes("at")
        ? `${role} ${company}`
        : `${role} of ${company}`;
  } else {
    subtitle = role || company || "";
  }

  // If avatar is provided, render avatar + text side-by-side
  if (avatar) {
    return (
      <div className="flex items-center gap-3 text-left select-none">
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-border ring-1 ring-white/10 shrink-0 bg-surface">
          <Image
            src={avatar}
            alt={author}
            fill
            sizes="48px"
            className="object-cover"
            unoptimized={avatar.startsWith("http")}
          />
        </div>
        <div className="flex flex-col">
          <div className="font-sans font-medium text-sm sm:text-md md:text-[1.2rem] text-foreground/75 tracking-tight leading-snug">
            {author}
          </div>
          {subtitle && (
            <div className="text-xs text-foreground/75 leading-tight mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If no avatar is provided (e.g. self-authored personal philosophy), render clean centered attribution
  return (
    <div className="flex flex-col items-center text-center select-none">
      <div className="font-display font-bold text-sm sm:text-base text-foreground tracking-tight">
        {author}
      </div>
      {subtitle && <div className="text-xs text-muted mt-0.5">{subtitle}</div>}
    </div>
  );
}

/**
 * Reusable, content-driven Quote / Credibility Highlight Section.
 * Supports both self-authored statements and client testimonials.
 *
 * @param {Object} props
 * @param {Object} [props.content] - Quote data object (quote, author, role, company, avatar, type)
 * @param {string} [props.className] - Additional container classes
 */
export default function TestimonialHighlight({
  content = defaultQuote,
  className = "",
}) {
  const { quote, author, role, company, avatar } = content;

  // Format quote with curly quotation marks if not already included
  const formattedQuote = quote
    ? quote.startsWith("“") || quote.startsWith('"')
      ? quote
      : `“${quote}”`
    : "";

  return (
    <section
      aria-label="Quote highlight"
      className={`min-h-fit bg-background border-t border-border section-py section-px ${className}`}
    >
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 items-center text-center">
        {/* ── Main Quote ─────────────────────────────────────────────────── */}
        <blockquote className="font-sans font-normal text-xl sm:text-2xl md:text-3xl lg:text-[1.8rem] text-foreground/75 leading-none md:leading-normal tracking-tight max-w-5xl">
          {formattedQuote}
        </blockquote>

        {/* ── Attribution Block ─────────────────────────────────────────── */}
        <QuoteAttribution
          author={author}
          role={role}
          company={company}
          avatar={avatar}
        />
      </div>
    </section>
  );
}

// Named alias export for convenience
export { TestimonialHighlight as QuoteHighlight };
