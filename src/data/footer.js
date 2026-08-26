import { person } from "./person";
import { siteConfig } from "./site";

/**
 * Central Data-Driven Content for the Contact & Footer Section
 */
export const footerData = {
  headline: {
    before: "Lets",
    rotatingWords: ["design", "create", "build"],
    after: "incredible work together.",
  },

  contact: {
    email: person.email,
    call: person.call,
    social: person.socialLinks,
  },

  menu: siteConfig.navLinks,

  copyright: siteConfig.copyright,

  closingText: person.closingBrandText,
};
