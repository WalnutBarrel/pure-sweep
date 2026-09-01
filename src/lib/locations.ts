export interface SuburbLocation {
  slug: string;
  name: string;
  region: string;
  postcode: string;
  title: string;
  metaDescription: string;
  headline: string;
  intro: string;
  popularServices: {
    title: string;
    slug: string;
    price: string;
    description: string;
  }[];
  areaFeatures: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const AUCKLAND_LOCATIONS: SuburbLocation[] = [
  {
    slug: "ponsonby",
    name: "Ponsonby",
    region: "Central Auckland",
    postcode: "1011",
    title: "House & Commercial Cleaning Ponsonby Auckland | PureSweep",
    metaDescription:
      "Reliable residential house cleaning, apartment upkeep, and commercial office cleaning services across Ponsonby, Auckland. Upfront flat pricing and easy online booking.",
    headline: "Professional Cleaning Services in Ponsonby, Auckland",
    intro:
      "From historic heritage villas to contemporary apartments along Ponsonby Road, PureSweep delivers thorough residential and commercial cleaning tailored to your schedule.",
    areaFeatures: [
      "Heritage Villa & Apartment House Cleaning",
      "Retail & Office Cleaning on Ponsonby Road",
      "End-of-Tenancy & Move-Out Deep Cleans",
      "Regular Weekly & Fortnightly Cleaning Schedules",
    ],
    popularServices: [
      {
        title: "Residential House Cleaning",
        slug: "residential-cleaning",
        price: "$40 + GST / hour",
        description: "Complete room upkeep covering kitchen sanitization, bathroom scrubbing, dusting, vacuuming, and mopping.",
      },
      {
        title: "Deep Cleaning & Move-Out",
        slug: "deep-cleaning",
        price: "Starting at $320 + GST",
        description: "Intensive scrubbing for skirting boards, tile grout, kitchen appliances, and window frames.",
      },
      {
        title: "Commercial Office Cleaning",
        slug: "commercial-cleaning",
        price: "$45 + GST / hour",
        description: "Daily or weekly workspace upkeep for Ponsonby offices, studios, and retail locations.",
      },
    ],
    faqs: [
      {
        question: "Do you service all areas around Ponsonby?",
        answer:
          "Yes, we cover all parts of Ponsonby and surrounding inner-west suburbs including Grey Lynn, Herne Bay, St Marys Bay, and Freemans Bay.",
      },
      {
        question: "How do I book a cleaning appointment in Ponsonby?",
        answer:
          "You can select your preferred service and schedule directly through our online booking page, or reach out via our contact form.",
      },
    ],
  },
  {
    slug: "remuera",
    name: "Remuera",
    region: "Eastern Auckland",
    postcode: "1050",
    title: "House & Deep Cleaning Remuera Auckland | PureSweep",
    metaDescription:
      "High-standard residential house cleaning and deep cleaning in Remuera, Auckland. Meticulous care for family homes and apartments with clear flat pricing.",
    headline: "Thorough Home & Deep Cleaning in Remuera, Auckland",
    intro:
      "PureSweep provides reliable, detail-oriented house cleaning for family homes, townhouses, and residences throughout Remuera and nearby eastern suburbs.",
    areaFeatures: [
      "Multi-Bedroom Family Home Cleaning",
      "Cobweb Removal, Skirting Boards & Detailed Dusting",
      "Kitchen, Oven & Bathroom Restorative Deep Cleans",
      "Regular Maintenance on Weekly or Fortnightly Cadence",
    ],
    popularServices: [
      {
        title: "Residential House Cleaning",
        slug: "residential-cleaning",
        price: "$40 + GST / hour",
        description: "Regular cleaning covering dust removal, floor care, kitchen sanitization, and full bathroom cleaning.",
      },
      {
        title: "Specialized Deep Cleaning",
        slug: "deep-cleaning",
        price: "Starting at $320 + GST",
        description: "Top-to-bottom detail scrub targeting hard-to-reach areas, interior windows, and appliances.",
      },
      {
        title: "Carpet Steam Cleaning",
        slug: "carpet-cleaning",
        price: "Starting at $250 + GST",
        description: "Steam extraction treatment for freshening home carpets and high-traffic hallways.",
      },
    ],
    faqs: [
      {
        question: "Do your cleaners cover cobweb removal and detailed dusting in Remuera?",
        answer:
          "Yes, high dusting, cobweb removal around cornices, and detailed skirting board wiping are included in our standard checklist and deep cleaning packages.",
      },
      {
        question: "Can I schedule a regular cleaner for my Remuera home?",
        answer:
          "Yes, we offer recurring weekly, fortnightly, or monthly cleaning schedules to keep your home consistently maintained.",
      },
    ],
  },
  {
    slug: "grey-lynn",
    name: "Grey Lynn",
    region: "Central Auckland",
    postcode: "1021",
    title: "House Cleaning Grey Lynn Auckland | PureSweep",
    metaDescription:
      "Friendly, professional house cleaning and deep cleaning services across Grey Lynn, Auckland. Honest rates, transparent communication, and simple booking.",
    headline: "Reliable House Cleaning Across Grey Lynn, Auckland",
    intro:
      "Whether you live in a classic timber villa near Grey Lynn Park or a modern townhouse along Williamson Ave, our team ensures your living spaces are fresh, sanitized, and tidy.",
    areaFeatures: [
      "Timber Floor & Surface Care",
      "Kitchen Counter & Appliance Cleaning",
      "Move-in / Move-out Tenancy Cleaning",
      "Flexible Morning and Afternoon Booking Slots",
    ],
    popularServices: [
      {
        title: "Residential House Cleaning",
        slug: "residential-cleaning",
        price: "$40 + GST / hour",
        description: "Comprehensive home cleaning covering kitchens, bathrooms, living areas, and bedrooms.",
      },
      {
        title: "Move-in / Move-out Cleaning",
        slug: "move-in-move-out-cleaning",
        price: "Starting at $320 + GST",
        description: "Detailed end-of-tenancy clean to prepare homes for handover or inspection.",
      },
      {
        title: "Commercial Office Upkeep",
        slug: "commercial-cleaning",
        price: "$45 + GST / hour",
        description: "Routine office hygiene and desk cleaning for local Grey Lynn businesses and shared workspaces.",
      },
    ],
    faqs: [
      {
        question: "Do you supply all the cleaning products for Grey Lynn bookings?",
        answer:
          "Yes, our cleaners bring all required vacuum cleaners, mops, microfibres, and cleaning solutions.",
      },
      {
        question: "What notice is required to reschedule in Grey Lynn?",
        answer:
          "You can reschedule your booking easily by notifying us in advance prior to your scheduled cleaning time.",
      },
    ],
  },
  {
    slug: "auckland-cbd",
    name: "Auckland CBD",
    region: "Central Auckland",
    postcode: "1010",
    title: "Commercial & Apartment Cleaning Auckland CBD | PureSweep",
    metaDescription:
      "Professional office cleaning and apartment cleaning in Auckland CBD. Reliable cleaning teams, upfront rates, and flexible after-hours commercial scheduling.",
    headline: "Office & Apartment Cleaning in Auckland CBD",
    intro:
      "Keep your central Auckland office spaces productive and your high-rise apartments spotless. PureSweep delivers structured commercial and residential cleaning across the CBD.",
    areaFeatures: [
      "Corporate Office & Boardroom Maintenance",
      "CBD Apartment & Studio Cleaning",
      "Staff Kitchens, Restrooms & High-Touch Sanitation",
      "After-Hours & Weekend Commercial Cleaning Options",
    ],
    popularServices: [
      {
        title: "Commercial Office Cleaning",
        slug: "commercial-cleaning",
        price: "$45 + GST / hour",
        description: "Desks, meeting rooms, rubbish removal, and sanitization for downtown workplaces.",
      },
      {
        title: "Apartment Residential Cleaning",
        slug: "residential-cleaning",
        price: "$40 + GST / hour",
        description: "Efficient apartment cleaning designed for compact CBD living spaces and rentals.",
      },
      {
        title: "End-of-Lease Deep Cleaning",
        slug: "deep-cleaning",
        price: "Starting at $320 + GST",
        description: "Full handover cleaning for apartments and commercial tenancies.",
      },
    ],
    faqs: [
      {
        question: "Can you clean offices outside standard business hours in Auckland CBD?",
        answer:
          "Yes, we accommodate early morning, evening, and weekend schedules for corporate and commercial cleaning clients in the CBD.",
      },
      {
        question: "Do you service secure high-rise residential buildings?",
        answer:
          "Yes, as long as building access or key drop arrangements are provided, our team regularly cleans apartments across the CBD.",
      },
    ],
  },
  {
    slug: "north-shore",
    name: "North Shore",
    region: "North Auckland",
    postcode: "0622",
    title: "House & Office Cleaning North Shore Auckland | PureSweep",
    metaDescription:
      "Trusted residential house cleaning and commercial cleaning across Takapuna, Albany, and Auckland's North Shore. Clear pricing and dependable cleaners.",
    headline: "Quality House & Commercial Cleaning on Auckland's North Shore",
    intro:
      "Serving Takapuna, Milford, Albany, Birkenhead, and surrounding North Shore communities with dependable residential cleaning and commercial office upkeep.",
    areaFeatures: [
      "Family Home & Coastal Property Cleaning",
      "Commercial Building & Office Upkeep",
      "Post-Renovation & Deep Cleaning Services",
      "Regular Weekly, Fortnightly & One-Off Bookings",
    ],
    popularServices: [
      {
        title: "Residential House Cleaning",
        slug: "residential-cleaning",
        price: "$40 + GST / hour",
        description: "Regular cleaning covering dust sanitization, vacuuming, mopping, and bathroom cleaning.",
      },
      {
        title: "Commercial Office Cleaning",
        slug: "commercial-cleaning",
        price: "$45 + GST / hour",
        description: "Reliable routine maintenance for North Shore offices, practices, and showrooms.",
      },
      {
        title: "Deep Cleaning Service",
        slug: "deep-cleaning",
        price: "Starting at $320 + GST",
        description: "Comprehensive seasonal or pre-sale deep scrub for houses across the North Shore.",
      },
    ],
    faqs: [
      {
        question: "Which North Shore suburbs do you service?",
        answer:
          "We service major North Shore areas including Takapuna, Milford, Devonport, Birkenhead, Northcote, and Albany.",
      },
      {
        question: "Do you offer one-off deep cleans for North Shore homes?",
        answer:
          "Yes, we provide both regular ongoing services and one-off deep cleaning packages.",
      },
    ],
  },
  {
    slug: "manukau",
    name: "Manukau",
    region: "South Auckland",
    postcode: "2104",
    title: "Commercial & House Cleaning Manukau Auckland | PureSweep",
    metaDescription:
      "Dependable commercial cleaning, floor maintenance, and house cleaning in Manukau and South Auckland. Simple flat pricing and responsive service.",
    headline: "Commercial & Residential Cleaning in Manukau, Auckland",
    intro:
      "PureSweep provides straightforward commercial office cleaning, retail space hygiene, and residential home cleaning for clients across Manukau and South Auckland.",
    areaFeatures: [
      "Commercial & Industrial Facility Office Cleaning",
      "Floor Sweeping, Mopping & Sanitization",
      "Residential House Cleaning & Move-Out Care",
      "Reliable Schedules with Upfront Rates",
    ],
    popularServices: [
      {
        title: "Commercial Office Cleaning",
        slug: "commercial-cleaning",
        price: "$45 + GST / hour",
        description: "Workplace hygiene, staff room sanitation, waste disposal, and floor care.",
      },
      {
        title: "Residential House Cleaning",
        slug: "residential-cleaning",
        price: "$40 + GST / hour",
        description: "Standard home cleaning covering kitchens, bathrooms, bedrooms, and common areas.",
      },
      {
        title: "Deep Cleaning & Tenancy",
        slug: "deep-cleaning",
        price: "Starting at $320 + GST",
        description: "Thorough deep scrub for rental transitions, sales, or seasonal maintenance.",
      },
    ],
    faqs: [
      {
        question: "Do you service commercial properties and warehouses in Manukau?",
        answer:
          "Yes, we clean office suites, staff breakrooms, reception areas, and facility amenities throughout Manukau.",
      },
      {
        question: "How can I request a quote for regular cleaning in Manukau?",
        answer:
          "You can fill out our online booking form or contact us with your property details for an immediate price estimate.",
      },
    ],
  },
  {
    slug: "east-tamaki",
    name: "East Tamaki",
    region: "East Auckland",
    postcode: "2013",
    title: "Commercial & Office Cleaning East Tamaki Auckland | PureSweep",
    metaDescription:
      "Reliable commercial office cleaning, floor care, and workplace sanitation in East Tamaki, Auckland. Flat hourly rates and consistent service.",
    headline: "Commercial & Office Cleaning in East Tamaki, Auckland",
    intro:
      "Supporting East Tamaki businesses with regular commercial cleaning, office maintenance, staff amenity hygiene, and floor care.",
    areaFeatures: [
      "Commercial Offices & Showrooms Upkeep",
      "Staff Kitchens & Restroom Sanitization",
      "Dusting, Floor Mopping & Vacuuming",
      "Flexible Cleaning Frequency (Daily, Weekly, Fortnightly)",
    ],
    popularServices: [
      {
        title: "Commercial Office Cleaning",
        slug: "commercial-cleaning",
        price: "$45 + GST / hour",
        description: "Dedicated workspace maintenance for desks, boardrooms, shared kitchens, and reception spaces.",
      },
      {
        title: "Specialized Deep Cleaning",
        slug: "deep-cleaning",
        price: "Starting at $320 + GST",
        description: "Detailed top-to-bottom scrub for commercial tenancies and properties.",
      },
      {
        title: "Residential House Cleaning",
        slug: "residential-cleaning",
        price: "$40 + GST / hour",
        description: "Quality home cleaning for residential properties in nearby eastern suburbs.",
      },
    ],
    faqs: [
      {
        question: "What commercial cleaning schedules do you offer in East Tamaki?",
        answer:
          "We offer daily, twice-weekly, weekly, or fortnightly cleaning schedules tailored to your business operations.",
      },
      {
        question: "Do you invoice GST on all commercial bookings?",
        answer:
          "Yes, clear itemized tax invoices with GST are provided for all commercial and residential accounts.",
      },
    ],
  },
  {
    slug: "mount-eden",
    name: "Mount Eden",
    region: "Central Auckland",
    postcode: "1024",
    title: "House & Deep Cleaning Mount Eden Auckland | PureSweep",
    metaDescription:
      "Detailed residential house cleaning, villa upkeep, and deep cleaning in Mount Eden, Auckland. Honest pricing and dependable cleaning teams.",
    headline: "Quality House Cleaning in Mount Eden, Auckland",
    intro:
      "PureSweep offers meticulous cleaning services for bungalows, villas, and modern townhouses in Mount Eden and surrounding central Auckland suburbs.",
    areaFeatures: [
      "Heritage Villa & Bungalow Cleaning",
      "Dusting, Vacuuming & Hardwood Floor Care",
      "Kitchen & Bathroom Sanitization",
      "Move-in and Move-out Deep Cleans",
    ],
    popularServices: [
      {
        title: "Residential House Cleaning",
        slug: "residential-cleaning",
        price: "$40 + GST / hour",
        description: "Thorough upkeep of living areas, kitchens, bathrooms, and bedrooms.",
      },
      {
        title: "Specialized Deep Cleaning",
        slug: "deep-cleaning",
        price: "Starting at $320 + GST",
        description: "Detailed restorative clean targeting baseboards, grout lines, oven, and window frames.",
      },
      {
        title: "Commercial Office Cleaning",
        slug: "commercial-cleaning",
        price: "$45 + GST / hour",
        description: "Professional cleaning for local practices and small businesses around Mt Eden Village.",
      },
    ],
    faqs: [
      {
        question: "Can I book a recurring clean for my home in Mount Eden?",
        answer:
          "Yes, you can choose weekly, fortnightly, or monthly recurring appointments through our booking page.",
      },
      {
        question: "Do you clean kitchen appliances in Mount Eden?",
        answer:
          "Yes, exterior appliance wiping is part of our standard clean, and intensive interior oven cleaning is available as a deep clean add-on.",
      },
    ],
  },
  {
    slug: "hillsborough",
    name: "Hillsborough",
    region: "Central-South Auckland",
    postcode: "1042",
    title: "Local House & Office Cleaning Hillsborough Auckland | PureSweep",
    metaDescription:
      "Locally based house cleaning and office maintenance in Hillsborough, Auckland. Dependable service, straightforward pricing, and easy booking.",
    headline: "Local Cleaning Services in Hillsborough, Auckland",
    intro:
      "Based right in Hillsborough, PureSweep provides prompt, friendly, and reliable residential house cleaning and small commercial maintenance throughout our local neighborhood.",
    areaFeatures: [
      "Local Hillsborough Residential Home Cleaning",
      "Prompt Service with Local Team Presence",
      "Kitchen, Bathrooms & Floor Care",
      "One-Off Deep Cleans & Regular Schedules",
    ],
    popularServices: [
      {
        title: "Residential House Cleaning",
        slug: "residential-cleaning",
        price: "$40 + GST / hour",
        description: "Comprehensive home cleaning covering kitchens, bathrooms, bedrooms, and living spaces.",
      },
      {
        title: "Specialized Deep Cleaning",
        slug: "deep-cleaning",
        price: "Starting at $320 + GST",
        description: "Detailed top-to-bottom scrub for seasonal spring cleaning or property handovers.",
      },
      {
        title: "Commercial Office Cleaning",
        slug: "commercial-cleaning",
        price: "$45 + GST / hour",
        description: "Hygiene and surface care for local commercial premises and offices.",
      },
    ],
    faqs: [
      {
        question: "Are you locally based in Hillsborough?",
        answer:
          "Yes, PureSweep is based in Hillsborough, Auckland (1042), providing rapid and reliable service across the local community.",
      },
      {
        question: "How do I get an instant price for my Hillsborough home?",
        answer:
          "Visit our booking page to calculate your estimate based on your home size and required service.",
      },
    ],
  },
];

export function getLocationBySlug(slug: string): SuburbLocation | undefined {
  return AUCKLAND_LOCATIONS.find((loc) => loc.slug === slug);
}
