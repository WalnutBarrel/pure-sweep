export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I book a cleaning service?",
    answer:
      "You can book directly through our website by selecting your required service and preferred date, or by getting in touch with us through our contact form.",
  },
  {
    question: "What is included in a standard house clean?",
    answer:
      "A standard clean includes dusting surfaces, vacuuming and mopping floors, cleaning kitchen countertops and sinks, and sanitizing bathrooms and toilets.",
  },
  {
    question: "Do I need to be home during the cleaning?",
    answer:
      "No, you do not need to be home as long as our team has clear access to the property. You can leave access instructions during booking.",
  },
  {
    question: "Do you bring your own cleaning supplies and equipment?",
    answer:
      "Yes, our cleaners come equipped with the necessary cleaning products, vacuum cleaners, and supplies to complete the service.",
  },
  {
    question: "How can I reschedule or cancel a booking?",
    answer:
      "You can easily reschedule or cancel by contacting us in advance before your scheduled cleaning appointment.",
  },
];
