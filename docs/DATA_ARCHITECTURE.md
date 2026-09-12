# Data Architecture & Flow Specification

## 1. Architectural Roles & Single Source of Truth

| Layer | Responsibility | Storage / Source | Runtime Policy |
|---|---|---|---|
| **Projects (Archive & Featured)** | Portfolio projects, case studies, videos | **Cloud Firestore** (`projects` collection) | **STRICT ZERO-FALLBACK**: Firestore ONLY. Never falls back to static files. |
| **Content Sections (Bio, FAQs, etc.)** | Copy, services, testimonials, footer | **Cloud Firestore** (`content` singleton docs) | **CONTROLLED FALLBACK**: Configurable per-section via `fallbackPolicy.js`. |
| **Master Reference List** | Human-readable project catalog for manual entry | `docs/PROJECTS.md` | Non-runtime reference only (never imported in code). |
| **Server Database Access** | Privileged database read/write operations | **Firebase Admin SDK** (`adminDb`) | Server-side only (`server-only`). |
| **Client Firebase Auth** | Admin authentication state only | **Firebase Client SDK** | Login only; no direct browser read/write to Firestore. |

---

## 2. Explicit Runtime State Model (Loading ≠ Empty ≠ Error)

Every runtime data resource must distinguish three distinct states:

```
Request Starts
      │
      ▼
┌──────────────┐
│   LOADING    │  ──► Request in progress. Display skeleton / loading UI.
└──────┬───────┘
       │
       ▼
Firestore Query Response
       │
       ├───────────────────────────────────────────────┐
       ▼                                               ▼
┌──────────────┐                               ┌──────────────┐
│   SUCCESS    │                               │    ERROR     │
└──────┬───────┘                               └──────┬───────┘
       │                                               │
       ├───────────────────────┐                       ▼
       ▼                       ▼               Is fallback enabled
┌──────────────┐        ┌──────────────┐       for this section?
│ DATA FOUND   │        │ EMPTY STATE  │               │
│ Render UI    │        │ Successful   │       ┌───────┴───────┐
│              │        │ 0 records    │       ▼               ▼
└──────────────┘        └──────────────┘    [YES]            [NO]
                                        Static fallback  Explicit Error
                                        template data    State UI
```

1. **LOADING**: Data request is still in-flight. Must never be skipped by prematurely returning static data.
2. **EMPTY**: Database request succeeded, but returned 0 documents / empty field. Must display an intentional empty state UI.
3. **ERROR**: Database query threw an exception or network failed. Must display an intentional error state UI. **An error must never be silently converted into an empty state or hidden with fallback unless explicitly configured.**

---

## 3. Runtime Policies by Data Type

### A. Projects Policy (Zero Fallback)
- **Runtime Source**: Cloud Firestore (`projects` collection) exclusively.
- **Fallback**: **NEVER**. No static project data is used at runtime.
- **Failures**: If Firestore query fails, an explicit Error state is returned.
- **Empty**: If Firestore returns 0 projects, an explicit Empty state ("No projects found") is displayed.
- **Manual Entry**: Projects are created and managed manually through the Admin Panel (`/admin/projects/new`), using `docs/PROJECTS.md` as reference.

### B. Content Policy (Per-Section Configurable Fallback)
- **Runtime Source**: Cloud Firestore (`content` collection).
- **Fallback**: Controlled centrally in `src/lib/config/fallbackPolicy.js`.
- If Firestore is unavailable or document unseeded:
  - If section fallback is `true`: serves local baseline from `src/data/*` with `_source: "fallback"`.
  - If section fallback is `false`: returns `null` or error state.

---

## 4. Central Fallback Policy Matrix

| Section Key | Firestore Doc | Fallback Configurable | Default Fallback Policy |
|---|---|---|---|
| `projects` | `projects/*` | **NO (Hardcoded Disabled)** | ❌ **DISABLED (Zero Fallback)** |
| `profile` | `content/profile` | **YES** | ⚠️ Configurable (`fallbackPolicy.js`) |
| `about` | `content/about` | **YES** | ⚠️ Configurable (`fallbackPolicy.js`) |
| `services` | `content/services` | **YES** | ⚠️ Configurable (`fallbackPolicy.js`) |
| `testimonials` | `content/testimonials` | **YES** | ⚠️ Configurable (`fallbackPolicy.js`) |
| `viewer-reactions`| `content/viewer-reactions` | **YES** | ⚠️ Configurable (`fallbackPolicy.js`) |
| `faqs` | `content/faqs` | **YES** | ⚠️ Configurable (`fallbackPolicy.js`) |
| `social-proof` | `content/social-proof` | **YES** | ⚠️ Configurable (`fallbackPolicy.js`) |
| `quote` | `content/quote` | **YES** | ⚠️ Configurable (`fallbackPolicy.js`) |
| `footer` | `content/footer` | **YES** | ⚠️ Configurable (`fallbackPolicy.js`) |
| `site` | `content/site` | **YES** | ⚠️ Configurable (`fallbackPolicy.js`) |

---

## 5. Admin Panel Data Integrity

- The Admin Panel (`/admin/*`) **never uses fallback data** for any section or project.
- Admin reads and writes directly to Firestore.
- Unseeded content sections in Admin render empty/unconfigured forms, prompting the admin to enter details.


