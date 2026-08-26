# Brand Logo Assets Registry

All vector brand marks are stored locally in `/public/logos/svg/` and consumed via `/logos/svg/<filename>.svg`.

## Source Attribution & Provenance

| Tool / Brand | Filename | Primary Source | Source Type | Official Status | License / Trademark Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Photoshop** | `photoshop.svg` | Devicon | Plain Solid Vector | Adobe Trademark Asset | MIT (Repo) / Adobe Inc. |
| **Illustrator** | `illustrator.svg` | Devicon | Plain Solid Vector | Adobe Trademark Asset | MIT (Repo) / Adobe Inc. |
| **Premiere Pro** | `premiere-pro.svg` | Devicon | Plain Solid Vector | Adobe Trademark Asset | MIT (Repo) / Adobe Inc. |
| **After Effects** | `after-effects.svg` | Devicon | Plain Solid Vector | Adobe Trademark Asset | MIT (Repo) / Adobe Inc. |
| **DaVinci Resolve** | `davinci-resolve.svg` | Simple Icons | Solid Brand Mark | Blackmagic Design Mark | CC0 / Blackmagic Design |
| **Figma** | `figma.svg` | Devicon / Figma Guidelines | Solid 5-Shape Mark | Official Figma Identity | Figma Brand Guidelines |
| **Framer** | `framer.svg` | Simple Icons | Solid 3-Polygon Mark | Official Framer Identity | CC0 / Framer B.V. |
| **Blender** | `blender.svg` | Simple Icons | Solid Brand Mark | Official Blender Mark | CC0 / Blender Foundation |
| **Canva** | `canva.svg` | Simple Icons | Solid Brand Mark | Official Canva Mark | CC0 / Canva Pty Ltd |
| **CapCut** | `capcut.svg` | Iconify / Hugeicons | Solid Geometry Mark | ByteDance / CapCut Identity | ByteDance / CapCut |
| **Notion** | `notion.svg` | Simple Icons | Solid 3D Cube Mark | Official Notion Mark | CC0 / Notion Labs, Inc. |
| **ChatGPT / OpenAI** | `chatgpt.svg` | SVG Logos (Gil Barbara) | Solid Spiral Mark | Official OpenAI Identity | CC0 / OpenAI, LLC |
| **Claude** | `claude.svg` | Simple Icons | Solid Spark Mark | Official Anthropic Mark | CC0 / Anthropic PBC |
| **Midjourney** | `midjourney.svg` | SVG Logos (Gil Barbara) | Solid Ship/Spiral Mark | Official Midjourney Mark | Midjourney, Inc. |

## Technical Implementation

- Every SVG uses `fill="currentColor"` so it can be dynamically tinted via Tailwind CSS text/background color utilities.
- Consumed via CSS `mask-image` in `ToolList.jsx` for zero-latency, zero-flicker vector rendering at any scale.
