import Link from "@/components/ui/Link";
import SocialProof from "@/components/social-proof/SocialProof";
import { person } from "@/data/person";
import HeroFace from "./HeroFace";

export default function Hero({
  tagline = person.tagline,
  ctaText = "Book a call with me",
  ctaHref = "#contact",
}) {
  return (
    <section className=" w-full pt-30 sm:pt-28 md:pt-28 bg-background flex flex-col justify-between items-center">
      <div className="max-w-252 pb-12 md:pb-18 lg:pb-22 px-6 sm:px-8 md:px-9 lg:px-10 xl:px-4 flex flex-col gap-80 md:gap-6 lg:gap-10 w-full flex-1 justify-center">
        {/* ── Headline ──────────────────────────────────────────────────── */}
        <h1 className="flex flex-col justify-center items-center select-none">
          <span className="font-display font-semibold text-[6.4rem] sm:text-[13rem] md:text-[10rem] lg:text-[14.5rem] uppercase tracking-tight text-foreground md:leading-[0.78] leading-[0.85]">
            THINK
          </span>

          <span className="font-display font-[630] text-[3.9rem] sm:text-[8rem] md:text-[8.3rem] lg:text-[11.9rem] tracking-[-0.02em] uppercase text-accent md:leading-[0.78] leading-[0.8]">
            CREATIVELY
          </span>
        </h1>

        {/* ── Bottom bar ────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto w-full px-1 sm:px-0 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Badge + tagline */}
          <div className="w-full md:w-64">
            <p className="text-center md:text-left md:text-balance font-sans font-normal text-[1.1rem] md:text-[1.25rem] leading-[1.3] text-foreground/80">
              {tagline}
            </p>
          </div>

          {/* CTA */}
          <Link href={ctaHref} variant="pill" color="red" className="md:py-2.5">
            {ctaText}
          </Link>
        </div>
      </div>

      {/* ── Client Proof & Brand Logos at bottom of Hero ─────────────── */}
      <SocialProof className="" />

      <HeroFace />
    </section>
  );
}
