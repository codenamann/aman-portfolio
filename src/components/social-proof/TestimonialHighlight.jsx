import Image from "next/image";

/**
 * Renders the author / person attribution block.
 */
function QuoteAttribution({ author, role, company, avatar }) {
  if (!author) return null;

  let subtitle = "";
  if (role && company) {
    subtitle =
      role.toLowerCase().includes("of") || role.toLowerCase().includes("at")
        ? `${role} ${company}`
        : `${role} of ${company}`;
  } else {
    subtitle = role || company || "";
  }

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
 */
export default function TestimonialHighlight({
  quote: quoteProp,
  content,
  profile,
  className = "",
}) {
  const activeContent = content || quoteProp;
  if (!activeContent || !activeContent.quote) {
    return null;
  }

  const quote = activeContent.quote;
  const author = activeContent.author || profile?.name || "";
  const role = activeContent.role || profile?.role || profile?.subtitle || "";
  const company = activeContent.company || "";
  const avatar =
    activeContent.type === "self" || !activeContent.author
      ? profile?.avatar || activeContent.avatar || ""
      : activeContent.avatar || "";

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
        <blockquote className="font-sans font-normal text-xl sm:text-2xl md:text-3xl lg:text-[1.8rem] text-foreground/75 leading-none md:leading-normal tracking-tight max-w-5xl">
          {formattedQuote}
        </blockquote>

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

export { TestimonialHighlight as QuoteHighlight };
