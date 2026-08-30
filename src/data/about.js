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
    "I started my journey with graphic design, exploring visuals, layouts, and creative ideas. It was where I first developed an interest in creating and expressing ideas through design.",
    "Over time, I became increasingly interested in video editing and motion. Moving beyond static visuals gave me a new way to experiment with movement, pacing, and visual expression.",
    "Through video and motion, I found a different way to approach storytelling. It allowed me to combine different elements and create work that could communicate an idea in a more dynamic and engaging way.",
    "Now, I’m exploring AI-powered visuals and bringing together design, editing, motion, and storytelling. I’m continuing to experiment with these different forms of creativity to create work that feels creative, clear, and engaging.",
  ],

  signature: person.signature,

  workHistory,
};
