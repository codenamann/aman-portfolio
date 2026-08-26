import { person } from "./person";
import { workHistory } from "./experience";

/**
 * Central Data-Driven Content for the About Section
 */
export const aboutData = {
  heading: {
    lineOne: "Designing experiences",
    lineTwo: "that make sense.",
  },

  profile: {
    name: person.name,
    role: person.role,
    image: person.avatar,
    socialLinks: person.socialLinks,
  },

  paragraphs: [
    "I started my journey with graphic design, exploring visuals, layouts, and creative ideas. Over the past 5 years, I’ve worked across different types of design, gradually understanding how everything connects and works together.",
    "With time, my focus shifted from just making designs to communicating ideas clearly. That’s when I began to see myself as a visual communicator, not just a designer.",
    "Now, I’m learning UI UX to understand how design works in real use. It’s helping me think beyond visuals and focus more on how people interact and experience things.",
    "My goal is to keep growing by combining my background in graphic design with UI UX, and building work that feels clear, useful, and meaningful.",
  ],

  signature: person.signature,

  workHistory,
};
