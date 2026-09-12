# Portfolio Content Architecture Audit & Firestore Migration Specification

> **Status:** PHASE 1 SPECIFICATION (UPDATED WITH ALL REVIEW CORRECTIONS — AWAITING EXPLICIT APPROVAL)  
> **Document Version:** 4.1.0 (Strict Zero-Default, De-duplicated Social Links & Canonical Ownership Model)  
> **Target Scope:** Portfolio Content-Driven Architecture & Admin CMS Alignment  
> **Core Principle:** DATA EXISTS → SHOW DATA. DATA DOES NOT EXIST → EMPTY. Zero visual redesign.

---

## 1. Executive Summary & Core Rules

This audit establishes the exact relationship between the public portfolio components, Cloud Firestore documents (`content/*` collection), and the Admin CMS management suite (`/admin/content`).

### Absolute Architectural Rules

1. **The Strict Binary State Rule**:
   - **STATE A — DATA EXISTS**: Firestore contains actual saved content $\longrightarrow$ Admin form displays that saved data.
   - **STATE B — DATA DOES NOT EXIST**: Firestore document or field does not exist $\longrightarrow$ Admin form displays an **EMPTY** state (`""`, `[]`, unchecked).
   - **NO THIRD STATE**: There is **NO** default data, initial value, example content, sample template, fallback content, suggested value, seed content, or placeholder content presented as fake values in Admin forms.
2. **Three Systems Must Agree**:
   $$\text{Public Component} \longrightarrow \text{Required Content} \longrightarrow \text{Firestore Field} \longrightarrow \text{Admin Input}$$
   No Admin field or Firestore property exists without an active, verified public UI consumer.
3. **Canonical Social Links (Zero Duplication)**:
   - Profile social channels are stored in **ONE canonical collection**: `socialLinks: Array<{ platform: string, url: string }>`.
   - Redundant individual fields (`instagramUrl`, `youtubeUrl`, `instagramDmUrl`) are **completely removed**.
   - Public consumers (Navbar quick buttons, ContactDropdown, ProfilePanel, Footer) derive their respective channel links directly from `socialLinks`.
   - `instagramDmUrl` has no independent consumer in the UI and is removed.
4. **Quote Attribution & Single-Owner Avatar**:
   - When `quote.type === "self"`, the quote component reuses `content/profile` (`name`, `role`/`subtitle`, and `avatar`). There is **zero asset duplication** for Aman's profile picture in Quote.
   - Quote-specific attribution fields and optional avatar are utilized **only** when `quote.type === "testimonial"` (i.e. an external guest/client quote).
5. **Red Signature Asset Integrity**:
   - The authentic red handwritten signature (`/about/signature.png`) remains visually untouched.
   - Script-font fallbacks (Caveat, text generators, replacement typography) are **strictly rejected**.
   - Cloudinary management stores the direct image asset reference without altering its visual presentation.
7. **Local Asset Reference Policy (No Fake Pre-population)**:
   - Local `/public/...` asset paths (e.g. `/passport-picture.png`, `/about/signature.png`, `/logos/*.png`) exist strictly for local reference / optional code fallback.
   - They must **NEVER** be automatically inserted into Firestore, used as Admin form defaults, or substituted for an empty CMS asset field.
   - If Firestore has no saved asset URL, the Admin field is strictly empty (`""`).
8. **Consistent Upload MIME Type Policy**:
   - **Avatars & Signature**: Raster images only (`image/jpeg`, `image/png`, `image/webp`). Max 5MB.
   - **Client Brand Logos**: Raster images and vectors (`image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`). Max 5MB.
9. **Social Proof Avatar Stack is 100% Hardcoded**:
   - The avatar stack displayed in the Social Proof section (`/avatars/avatar1.jpg` – `avatar5.jpg`) is **100% static in code/local**.
   - No Firestore fields, no Admin upload controls, no Cloudinary assets, and no editable lists.
8. **Social Proof Client Brand Logos**:
   - Client company logos displayed in the horizontal scrolling marquee bar are CMS-managed (`content/social-proof.clientBrandLogos`) so the owner can add, reorder, or update brand partner logos as client relationships evolve.
9. **Creative Tools Real Vector Logos**:
   - Predefined tool catalog, tool names, SVG vector masks (`/logos/svg/*.svg`), and brand colors reside permanently in code (`src/lib/logos.js`).
   - Firestore controls **only** `enabledTools: string[]` (e.g. `["premiere-pro", "after-effects", "photoshop"]`).
   - No text abbreviation badges (`Pr`, `Ps`, etc.) in the tool catalog or Admin UI.
10. **Services System Separation**:
    - The ServiceCard icon system (`icon: "shortform" | "motion" | "color" | "sound" | "brand"`) is separate from Creative Tools and maps directly to Lucide icons (`Video`, `Sparkles`, `Palette`, `Music`, `Film`).
    - The `variant` field (`"dark"` | `"accent"`) is preserved as it directly drives card theming and scroll-linked rotation angles (`[-40, 0]` vs `[40, 0]`).
11. **Server-Side Mutation & Zero Fallback in Admin**:
    - Deny-by-default Firestore rules (`allow read, write: if false;`) require that all mutations occur via authenticated server endpoints (`POST /api/admin/upload`, `PUT /api/admin/content/[section]`) protected by `requireAdminAuth()`.
    - Local fallback (`MASTER_FALLBACK_ENABLED = false`) is strictly isolated from Admin (`forceNoFallback: true`). Video projects (`projects/*`) have zero fallback under all circumstances.

---

## 2. Section-by-Section Audit

| Section | Current Source | Actual Consumer Component | Lives in Firestore? | Proposed Location | Justification / Render Location |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Navbar** | `src/data/person.js`<br>`src/data/site.js` | [`Navbar.jsx`](file:///d:/Workspace/creative-portfolio/src/components/layout/Navbar.jsx)<br>[`ContactDropdown.jsx`](file:///d:/Workspace/creative-portfolio/src/components/layout/ContactDropdown.jsx) | **Yes (Profile only)**<br>No (Routes & Labels) | `content/profile` (`avatar`, `displayName`, `email`, `bookingUrl`, `socialLinks`)<br>Code (Routes & "BOOK" label) | Avatar, Display Name, Booking URL, and Social Links (Instagram, YouTube) are rendered in the top nav capsule, quick icons, and dropdown. Navigation routes (`/`, `/projects`) and button label `"BOOK"` stay in code. |
| **Hero** | `src/data/person.js`<br>Hardcoded JSX | [`Hero.jsx`](file:///d:/Workspace/creative-portfolio/src/components/hero/Hero.jsx) | **Yes (Marketing copy & Profile)**<br>No (Headings & CTA label) | `content/profile` (`tagline`, `bookingUrl`)<br>Code (`THINK CREATIVELY`, `"Book a call with me"`) | Massive editorial heading `THINK CREATIVELY` is fixed layout typography. Tagline is editable marketing copy. CTA button label is fixed in code and links to `profile.bookingUrl`. Interactive Bitmoji face is static in code. |
| **Social Proof Summary & Bar** | `src/data/socialProof.js` | [`SocialProof.jsx`](file:///d:/Workspace/creative-portfolio/src/components/social-proof/SocialProof.jsx)<br>[`SocialProofSummary.jsx`](file:///d:/Workspace/creative-portfolio/src/components/social-proof/SocialProofSummary.jsx) | **Yes (Stats & Client Logos)**<br>No (Avatar Stack) | `content/social-proof` (`satisfiedClients`, `rating`, `clientBrandLogos`)<br>Code (Avatar stack) | Satisfied clients metric (`satisfiedClients`), star rating (`rating`), and client brand logos (`clientBrandLogos`). **Avatar stack (`/avatars/avatar1-5.jpg`) stays 100% hardcoded in code.** |
| **Featured Projects** | Firestore `projects/*`<br>`content/homepage-featured` | [`Projects.jsx`](file:///d:/Workspace/creative-portfolio/src/components/projects/Projects.jsx) | **Already Firestore** | `projects/*`<br>`content/homepage-featured` | 4 Shorts + 4 Long-form video slots resolved dynamically via server-side project service. |
| **Philosophy Quote** | `src/data/quote.js` | [`TestimonialHighlight.jsx`](file:///d:/Workspace/creative-portfolio/src/components/social-proof/TestimonialHighlight.jsx) | **Yes** | `content/quote` | Quote statement text (`quote`). If `type === "self"`, reuses `content/profile` for author, role, and avatar with zero duplication. If `type === "testimonial"`, allows bespoke attribution fields. |
| **Services Section** | `src/data/services.js` | [`Services.jsx`](file:///d:/Workspace/creative-portfolio/src/components/services/Services.jsx)<br>[`ServiceCard.jsx`](file:///d:/Workspace/creative-portfolio/src/components/services/ServiceCard.jsx) | **Yes (Cards)**<br>No (Heading & Icons) | `content/services` | Heading (`What I help you to Shape...`) is static in code. Service cards (`title`, `description`, `tags`, `icon`, `variant`) are dynamic array entries with icons mapped in code to Lucide components (`Video`, `Sparkles`, `Palette`, `Music`, `Film`). `variant` controls theme and scroll rotation. |
| **Creative Tools** | `src/data/services.js`<br>`src/lib/logos.js` | [`ToolList.jsx`](file:///d:/Workspace/creative-portfolio/src/components/services/ToolList.jsx) | **Yes (Selection only)**<br>No (SVGs/Catalog/Title) | `content/creative-tools` | Title (`Tools that I use`) is in code. Firestore stores `enabledTools: string[]` of active tool IDs. Tool names, SVG masks, and brand colors reside permanently in code. |
| **About Bio & Portrait** | `src/data/about.js` | [`About.jsx`](file:///d:/Workspace/creative-portfolio/src/components/about/About.jsx)<br>[`ProfilePanel.jsx`](file:///d:/Workspace/creative-portfolio/src/components/about/ProfilePanel.jsx)<br>[`AboutContent.jsx`](file:///d:/Workspace/creative-portfolio/src/components/about/AboutContent.jsx) | **Yes (Story/History/Signature)**<br>No (Headings) | `content/about`<br>`content/profile` (Avatar & metadata) | Headings (`Designing experiences` / `that make sense.`) are static in code. Bio story paragraphs (`paragraphs`), signature image reference (`signature`), and work history live in `content/about`. Sticky portrait card reuses `content/profile`. |
| **Work History** | `src/data/about.js` | [`WorkHistory.jsx`](file:///d:/Workspace/creative-portfolio/src/components/about/WorkHistory.jsx)<br>[`ExperienceCard.jsx`](file:///d:/Workspace/creative-portfolio/src/components/about/ExperienceCard.jsx) | **Yes** | `content/about.workHistory` | Title (`My work history`) is in code. List of career milestones: company (`company`), title (`role`), period (`period`). |
| **Client Testimonials** | `src/data/testimonials.js` | [`Testimonials.jsx`](file:///d:/Workspace/creative-portfolio/src/components/social-proof/Testimonials.jsx)<br>[`TestimonialCard.jsx`](file:///d:/Workspace/creative-portfolio/src/components/social-proof/TestimonialCard.jsx) | **Yes** | `content/testimonials` | Top marquee rail scrolling leftward: quote (`quote`), author (`author`), role/company (`role`), optional avatar (`avatar`), star rating (`rating`). |
| **Viewer Reactions** | `src/data/viewerReactions.js` | [`ViewerReactions.jsx`](file:///d:/Workspace/creative-portfolio/src/components/social-proof/ViewerReactions.jsx)<br>[`CommentCard.jsx`](file:///d:/Workspace/creative-portfolio/src/components/social-proof/CommentCard.jsx) | **Yes** | `content/viewer-reactions` | Bottom marquee rail scrolling rightward: username (`username`), comment (`comment`), age (`age`), likes count (`likes`), optional avatar (`avatar`). |
| **Marquee Visibility Config** | `src/components/social-proof/Testimonials.jsx` | [`Testimonials.jsx`](file:///d:/Workspace/creative-portfolio/src/components/social-proof/Testimonials.jsx) | **Yes** | `content/testimonials-config` | Dual boolean toggles: `{ showTestimonials: boolean, showViewerReactions: boolean }` supporting 4 states (OFF/OFF, ON/OFF, OFF/ON, ON/ON). |
| **FAQs** | `src/data/faqs.js` | [`FAQSection.jsx`](file:///d:/Workspace/creative-portfolio/src/components/faq/FAQSection.jsx)<br>[`FAQAccordion.jsx`](file:///d:/Workspace/creative-portfolio/src/components/faq/FAQAccordion.jsx) | **Yes** | `content/faqs.faqs` | Title (`FAQs`) is in code. Array of accordion items: question (`question`) and detailed answer (`answer`). |
| **Discovery CTA** | `src/data/faqs.js` | [`DiscoveryCTA.jsx`](file:///d:/Workspace/creative-portfolio/src/components/faq/DiscoveryCTA.jsx) | **Yes (Copy only)** | `content/faqs.cta`<br>`content/profile` (Booking URL & Avatar) | Sticky accent card: title (`title`), description paragraphs (`description`). Reuses `content/profile` for booking link (`bookingUrl`) and avatar (`avatar`). Button labels (`Schedule Now`, `Cal.com`) stay in code. |
| **Footer** | `src/data/footer.js` | [`Footer.jsx`](file:///d:/Workspace/creative-portfolio/src/components/contact/Footer.jsx)<br>[`ContactRow.jsx`](file:///d:/Workspace/creative-portfolio/src/components/contact/ContactRow.jsx) | **Reuses Profile**<br>No (Copy/Brand/Menu) | `content/profile` | Strictly `email`, `bookingUrl`, and `socialLinks` come from `content/profile`. Headlines, rotating word transitions, navigation links, copyright, and closing brand typography `MR. AMAN` stay 100% static in code. **No separate `content/footer` doc.** |
| **Projects Archive** | Firestore `projects/*`<br>`content/featured-showcase` | [`ProjectsArchive.jsx`](file:///d:/Workspace/creative-portfolio/src/components/projects/ProjectsArchive.jsx) | **Already Firestore** | `projects/*`<br>`content/featured-showcase` | Published projects grid with 5-slot showcase banner. |

---

## 3. Canonical Firestore Schema & Field Types

```typescript
// 1. content/profile
interface ProfileDocument {
  name: string;                // Full personal name (e.g. "Aman Shrivastava")
  displayName: string;         // Short nav name (e.g. "Aman")
  role: string;                // Professional title (e.g. "Video Editor & Motion Designer")
  tagline: string;             // Hero bottom bar marketing hook
  avatar: string;              // Cloudinary secureUrl or local asset reference
  email: string;               // Direct email string (e.g. "shrivastavaaman176@gmail.com")
  bookingUrl: string;          // Direct Cal.com / Calendly URL (e.g. "https://cal.com/...")
  socialLinks: Array<{         // Single canonical social links collection
    platform: "instagram" | "youtube" | "linkedin" | "behance" | "dribbble" | "x";
    url: string;               // Full profile URL (e.g. "https://instagram.com/...")
  }>;
  updatedAt?: string;
  updatedBy?: string;
}

// 2. content/about
interface AboutDocument {
  paragraphs: string[];        // Array of bio story paragraphs
  signature?: string;          // Cloudinary secureUrl or local asset path to authentic red signature PNG
  workHistory: Array<{
    id?: string;
    company: string;           // Organization / Agency name
    role: string;              // Job title
    period: string;            // Duration string (e.g. "2022 — Present")
  }>;
  updatedAt?: string;
  updatedBy?: string;
}

// 3. content/services
interface ServicesDocument {
  services: Array<{
    id: string;                // Unique service key (e.g. "shortform")
    title: string;             // Service title
    description: string;       // Service explanation copy
    icon: "shortform" | "motion" | "color" | "sound" | "brand"; // Code-mapped Lucide icon key
    tags: string[];            // 3-4 capability badges
    variant: "dark" | "accent";// Card visual theme & scroll rotation angle
  }>;
  updatedAt?: string;
  updatedBy?: string;
}

// 4. content/creative-tools
interface CreativeToolsDocument {
  enabledTools: string[];      // Array of active tool IDs from code catalog (e.g. ["premiere-pro", "after-effects"])
  updatedAt?: string;
  updatedBy?: string;
}

// 5. content/testimonials
interface TestimonialsDocument {
  testimonials: Array<{
    id: string;
    quote: string;             // Client testimonial statement
    author: string;            // Client name
    role?: string;             // Title & company (e.g. "Founder, Acme Co.")
    company?: string;
    avatar?: string;           // Optional client photo URL (empty if unset)
    rating?: number;           // 1 to 5 star rating (empty if unset under zero-default rule)
  }>;
  updatedAt?: string;
  updatedBy?: string;
}

// 6. content/viewer-reactions
interface ViewerReactionsDocument {
  reactions: Array<{
    id: string;
    username: string;          // Handle (e.g. "@creator_hub")
    comment: string;           // Comment text
    age?: string;              // Timestamp (e.g. "1w")
    likes?: string;            // Likes string (e.g. "12 likes")
    avatar?: string;           // Optional user photo URL
  }>;
  updatedAt?: string;
  updatedBy?: string;
}

// 7. content/testimonials-config
interface TestimonialsConfigDocument {
  showTestimonials: boolean;   // Controls top client rail (true/false)
  showViewerReactions: boolean;// Controls bottom comments rail (true/false)
  updatedAt?: string;
  updatedBy?: string;
}

// 8. content/social-proof
interface SocialProofDocument {
  satisfiedClients: string;    // Client count string (e.g. "20+" or "147+")
  rating: number;              // Numeric rating (1-5, e.g. 5)
  clientBrandLogos: Array<{
    src: string;               // Cloudinary logo URL / local path
    alt?: string;              // Brand name
  }>;
  // NOTE: Avatar stack is NOT stored in Firestore; it is hardcoded in code.
  updatedAt?: string;
  updatedBy?: string;
}

// 9. content/faqs
interface FaqsDocument {
  faqs: Array<{
    id: string;
    question: string;          // Question string
    answer: string;            // Detailed answer string
  }>;
  cta: {
    title?: string;            // Discovery CTA headline
    description?: string[];    // Array of value proposition copy paragraphs
  };
  updatedAt?: string;
  updatedBy?: string;
}

// 10. content/quote
interface QuoteDocument {
  type: "self" | "testimonial";// "self" reuses content/profile (zero duplication); "testimonial" allows bespoke attribution
  quote: string;               // Creative statement quote
  author?: string;             // Bespoke author name (used only if type === "testimonial")
  role?: string;               // Bespoke role (used only if type === "testimonial")
  company?: string;            // Bespoke company (used only if type === "testimonial")
  avatar?: string;             // Bespoke avatar URL (used only if type === "testimonial")
  updatedAt?: string;
  updatedBy?: string;
}
```

---

## 4. Admin CMS Audit & Field Cleaning Table

| Admin Tab | Input Field | Target Firestore Field | Public Consumer | Action | Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Profile** | Full Name | `profile.name` | ProfilePanel, Quote, Schema | **KEEP (Empty if unset)** | Core personal identity. |
| **Profile** | Display Name | `profile.displayName` | Navbar brand capsule | **KEEP (Empty if unset)** | Top-bar short name. |
| **Profile** | Role / Title | `profile.role` | ProfilePanel subtitle | **KEEP (Empty if unset)** | Professional title. |
| **Profile** | Avatar Image (Upload) | `profile.avatar` | Navbar, ProfilePanel, CTA | **KEEP (Empty if unset)** | Canonical portrait photo. Reused across site. |
| **Profile** | Hero Tagline | `profile.tagline` | Hero bottom bar badge | **KEEP (Empty if unset)** | Marketing hook text. |
| **Profile** | Closing Brand Text (`MR. AMAN`) | — | `FooterSignature.jsx` | **REMOVE FROM CMS** | Hardcoded in code per explicit rule. |
| **Profile** | Email Display Label ("Email") | — | `ContactRow.jsx` | **REMOVE FROM CMS** | Fixed UI label in code. |
| **Profile** | Email Address | `profile.email` | Navbar, Footer | **KEEP (Clean String)** | Scalar email value. |
| **Profile** | Booking Action Label ("Schedule Now") | — | `Navbar.jsx`, `Footer.jsx` | **REMOVE FROM CMS** | Fixed UI label in code. |
| **Profile** | Booking URL | `profile.bookingUrl` | Navbar, Hero, CTA, Footer | **KEEP (Clean String)** | Scalar Cal.com booking URL. |
| **Profile** | Social Links List | `profile.socialLinks` | Navbar, ProfilePanel, Footer | **KEEP (Canonical Array)** | Single source of truth for Instagram, YouTube, LinkedIn, etc. |
| **Profile** | Duplicate Instagram URL | — | — | **REMOVED** | Replaced by canonical `socialLinks`. |
| **Profile** | Duplicate YouTube URL | — | — | **REMOVED** | Replaced by canonical `socialLinks`. |
| **Profile** | Instagram DM URL | — | — | **REMOVED** | No independent public consumer. |
| **About** | Section Heading (`Designing experiences...`) | — | `About.jsx` | **EXCLUDE FROM CMS** | Static in code per explicit rule. |
| **About** | Story Paragraphs | `about.paragraphs` | `AboutContent.jsx` | **KEEP (Empty array if unset)** | Bio narrative copy array. |
| **About** | Signature Image (Upload) | `about.signature` | `AboutContent.jsx` | **KEEP (Empty if unset)** | Real red handwritten signature graphic. No script fallbacks. |
| **About** | Work History Entries | `about.workHistory` | `WorkHistory.jsx` | **KEEP (Empty array if unset)** | Career milestones (`company`, `role`, `period`). |
| **Services** | Section Heading (`What I help you to Shape...`) | — | `Services.jsx` | **EXCLUDE FROM CMS** | Static in code per explicit rule. |
| **Services** | Service Cards List | `services.services` | `ServiceCard.jsx` | **KEEP (Empty array if unset)** | `title`, `description`, `tags`, `icon`, `variant`. |
| **Creative Tools** | Tool Selection Grid | `creative-tools.enabledTools`| `ToolList.jsx` | **KEEP (Unchecked if unset)**| Real vector logos catalog from code to toggle on/off. No abbreviation badges. |
| **Testimonials** | Testimonials List | `testimonials.testimonials` | `TestimonialCard.jsx`| **KEEP (Empty array if unset)** | Client quotes, author, role, rating, avatar. |
| **Testimonials** | Marquee Visibility Toggles | `testimonials-config` | `Testimonials.jsx` | **KEEP (Booleans)** | Dual booleans (`showTestimonials`, `showViewerReactions`). |
| **Viewer Reactions**| Reactions List | `viewer-reactions.reactions`| `CommentCard.jsx` | **KEEP (Empty array if unset)** | Social feedback comments (`username`, `comment`, `age`, `likes`, `avatar`). |
| **Social Proof** | Satisfied Clients Metric | `social-proof.satisfiedClients` | `SocialProofSummary.jsx`| **KEEP (Empty if unset)** | Numerical social proof badge (`"20+"`). |
| **Social Proof** | Star Rating | `social-proof.rating` | `SocialProofSummary.jsx`| **KEEP (Empty if unset)** | 1–5 star rating summary. |
| **Social Proof** | Avatar Stack Images | — | `AvatarStack.jsx` | **REMOVE FROM CMS** | Kept 100% hardcoded in code (`/avatars/avatar1-5.jpg`). |
| **Social Proof** | Brand Logos (Upload) | `social-proof.clientBrandLogos`| `SocialProof.jsx` | **KEEP (Empty array if unset)** | Client brand logo marquee for updating brand partners. |
| **FAQs** | FAQ Accordion Pairs | `faqs.faqs` | `FAQAccordion.jsx` | **KEEP (Empty array if unset)** | `question` and `answer` pairs. |
| **FAQs** | Discovery CTA Copy | `faqs.cta` | `DiscoveryCTA.jsx` | **KEEP (Empty if unset)** | `title` and `description` copy. (Reuses `profile.bookingUrl` and `profile.avatar`). |
| **Quote** | Quote Text & Mode | `quote` | `TestimonialHighlight.jsx` | **KEEP (Empty if unset)** | "self" mode reuses `profile.avatar/name/role`. "testimonial" mode enables custom attribution. |
| **Footer** | Headline / Menu / Copyright / `MR. AMAN` | — | `Footer.jsx` | **EXCLUDE FROM CMS** | Kept 100% in code; contact data reuses `content/profile`. |

---

## 5. Duplicate Data Analysis & Centralization

| Duplicate Concept | Discovered Occurrences in Code | Canonical Firestore Field | Components Centralized to Canonical Source |
| :--- | :--- | :--- | :--- |
| **Full Name** | `person.name`, `about.heading`, `footer.copyright`, `quote.author` | `content/profile.name` | Navbar, ProfilePanel, Quote Attribution, Schema |
| **Display Name** | `person.displayName`, Navbar header | `content/profile.displayName` | Navbar top capsule badge |
| **Role / Subtitle** | `person.role`, `person.subtitle`, `about.profile.role` | `content/profile.role` | About sticky ProfilePanel, Quote Attribution |
| **Profile Photo / Avatar** | `person.avatar`, `about.profile.image`, `faqs.discoveryCTA.avatar`, `quote.avatar` | `content/profile.avatar` | Navbar logo icon, ProfilePanel portrait, Discovery CTA card, Quote Attribution (when self) |
| **Contact Email** | `person.email`, `footer.contact.email`, Navbar dropdown | `content/profile.email` | Navbar dropdown, Footer contact row |
| **Call Booking URL** | `person.call`, `faqs.discoveryCTA.primaryButton`, `footer.contact.call`, Navbar BOOK button, Hero CTA | `content/profile.bookingUrl` | Navbar BOOK button & dropdown, Hero pill CTA, Discovery CTA button, Footer call link |
| **Social Links (Instagram, YouTube, etc.)** | `person.instagram`, `person.youtube`, `footer.contact.social`, `about.profile.socialLinks`, Navbar quick icons | `content/profile.socialLinks` | Navbar quick buttons, Mobile nav, ProfilePanel pill overlay, Footer social icons |

---

## 6. Static Data vs Code vs Local Fallback

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. FIRESTORE (CMS-Managed Dynamic Content)                            │
├────────────────────────────────────────────────────────────────────────┤
│ • Profile & Global Contact (name, displayName, role, avatar, email,    │
│   bookingUrl, canonical socialLinks[])                                 │
│ • About Bio Paragraphs, Signature Image, Work History Milestones       │
│ • Services Cards, Icons & Variants                                     │
│ • Enabled Creative Tool IDs (string[])                                 │
│ • Testimonials & Viewer Reactions                                      │
│ • Marquee Rail Visibility Booleans                                     │
│ • Social Proof Stats, Client Brand Logos                               │
│ • FAQ Questions/Answers & Discovery CTA Copy                           │
│ • Philosophy Quote Statement & Mode                                    │
└────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ 2. CODE-CONTROLLED (Visual, Animation & Application Structure)         │
├────────────────────────────────────────────────────────────────────────┤
│ • Social Proof Avatar Stack Images (/avatars/avatar1-5.jpg) & Layout   │
│ • Navigation Routes (/projects, /#about, etc.)                         │
│ • Fixed UI Labels ("Email", "Book a call", "Schedule Now", "FAQs")     │
│ • About Section Heading ("Designing experiences that make sense.")     │
│ • Services Section Heading ("What I help you to Shape...")             │
│ • Hero Heading ("THINK CREATIVELY") & Interactive Bitmoji Face         │
│ • Footer Typography ("MR. AMAN"), Headlines & Rotating Words           │
│ • Tool Catalog Definitions, SVG Masks, Brand Colors (src/lib/logos.js) │
│ • Service Card Lucide Icons & Scroll-Linked Angles                     │
│ • Infinite Marquee Physics & CSS Scroll Architecture                   │
│ • Lenis Smooth Scrolling, Layout Grids, Responsive Breakpoints         │
└────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ 3. LOCAL FALLBACK / REFERENCE (Controlled by MASTER_FALLBACK_ENABLED)  │
├────────────────────────────────────────────────────────────────────────┤
│ • Stored in src/data/* for reference / optional local fallback         │
│ • Strictly inactive when MASTER_FALLBACK_ENABLED = false                │
│ • Admin CMS never receives fallback data (forceNoFallback: true)       │
│ • Video Projects have ZERO fallback under all circumstances            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Migration Risks & Safeguards

1. **Missing Document Rendering**:
   - *Risk*: If a Firestore doc does not exist and fallback is disabled, a component could crash on `undefined`.
   - *Safeguard*: All public components use defensive optional chaining and fallback empty arrays (`|| []`). Missing sections render empty without breaking the page layout.
2. **Contact Link Inconsistency**:
   - *Risk*: Inconsistent booking links between Navbar, CTA, and Footer.
   - *Safeguard*: Centralized to `content/profile.bookingUrl` and `content/profile.socialLinks`.
3. **Seeding & Default Data Leakage**:
   - *Risk*: Accidental auto-population of Firestore with dummy data or Admin displaying fake values.
   - *Safeguard*: Zero seed endpoints, seed files, auto-fill buttons, or form default values. Forms render pure empty states (`""`, `[]`) until actual Firestore data is entered.

---

## 8. Explicit Do-Not-Change List

- [x] Do NOT move About heading into Firestore.
- [x] Do NOT move Services heading into Firestore.
- [x] Do NOT move Footer `MR. AMAN` into Firestore.
- [x] Do NOT create CMS/Firestore fields for the Social Proof avatar stack.
- [x] Do NOT create fake/abbreviated tool logos (Pr, Ps, etc.).
- [x] Do NOT introduce script font / text signature fallbacks for the red signature.
- [x] Do NOT duplicate Aman's avatar in Quote when `type === "self"`.
- [x] Do NOT maintain duplicate social fields (`instagramUrl`, `youtubeUrl`, `instagramDmUrl`) alongside `socialLinks`.
- [x] Do NOT add static fallbacks to video projects.
- [x] Do NOT modify Lenis, Framer Motion, or InfiniteMarquee animations.
- [x] Do NOT modify font typography, colors, padding, or borders.
- [x] Do NOT inject default, fallback, sample, or placeholder values into Admin forms.
