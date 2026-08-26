import { person } from "./person";

/**
 * Central Data-Driven FAQ and Discovery CTA Content
 */
export const faqsData = [
  {
    id: "faq-1",
    question: "How do we get started?",
    answer:
      "We start with a quick discussion where you share your idea, goals, and what you need. From there, I suggest the right approach and next steps.",
  },
  {
    id: "faq-2",
    question: "What is your typical design process?",
    answer:
      "We begin with research and strategy, followed by concepts and iterations. Once the direction is locked, we build the final deliverables and guidelines.",
  },
  {
    id: "faq-3",
    question: "Will I be involved in the design process?",
    answer:
      "Absolutely. Collaboration is key. You'll be involved at every milestone with regular check-ins, asynchronous video updates, and structured feedback sessions.",
  },
  {
    id: "faq-4",
    question: "How many changes can I request?",
    answer:
      "I include 2–3 structured revision rounds for each milestone to ensure everything is refined to perfection without slowing down momentum.",
  },
  {
    id: "faq-5",
    question: "Do you only design, or also help with ideas?",
    answer:
      "I work as a strategic creative partner. Beyond visual execution, I help shape narrative direction, positioning, and overall experience thinking.",
  },
  {
    id: "faq-6",
    question: "How long does a typical project take to complete?",
    answer:
      "Most projects take between 2 to 6 weeks depending on scope, deliverables, and feedback turnaround. A clear timeline is always set upfront.",
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
