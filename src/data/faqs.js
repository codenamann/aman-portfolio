import { person } from "./person";

/**
 * Central Data-Driven FAQ and Discovery CTA Content
 */
export const faqsData = [
  {
    id: "faq-1",
    question: "How do we get started?",
    answer:
      "We start with a quick call where you share your video, goals, and platform (Reels, Shorts, YouTube, etc.). From there, I'll suggest the right editing approach and timeline for your project.",
  },
  {
    id: "faq-2",
    question: "What is your typical editing process?",
    answer:
      "I begin by reviewing the raw footage and understanding the message you want to land. Then I structure the story, cut for pacing, add sound design and color, and layer in motion graphics or captions where they'll boost retention — before sending you a first draft for feedback.",
  },
  {
    id: "faq-3",
    question: "Will I be involved in the editing process?",
    answer:
      "Yes. I usually share a rough cut first so you can flag anything before I move to the final polish — color, sound mix, and export.",
  },
  {
    id: "faq-4",
    question: "How many changes can I request?",
    answer:
      "I offer up to [2] rounds of revisions per project . Beyond that, additional revisions can be discussed based on scope.",
  },
  {
    id: "faq-5",
    question: "Do you only edit, or also help with ideas?",
    answer:
      "Both. I've written and structured Reel scripts and content calendars for brands, not just edited footage — so I can help shape the concept and pacing before the edit even starts, not just execute a raw cut.",
  },
  {
    id: "faq-6",
    question: "How long does a typical project take to complete?",
    answer:
      "Turnaround depends on length and complexity — a short-form Reel or Short usually takes [ 1-2 days], while a longer brand video takes [4-5 days]. I'll confirm a timeline once I see the raw footage.",
  },
];

export const discoveryCTAData = {
  avatar: person.avatar,
  title: "Still not sure?\nBook a free discovery call.",
  description: [
    "It should make your brand clear, strong, and easy to trust.",
    "If that’s what you’re aiming for, we should talk.",
  ],
  primaryButton: {
    label: "Schedule Now",
    href: person.call.href,
  },
  secondaryLabel: "Cal.com",
  secondaryHref: person.call.href,
};
