import { HomeIcon, LineChartIcon, PiggyBankIcon } from "lucide-react";
import { ExternalToast } from "sonner";

export const TITLE_CHAR_LIMIT = 20 as const;
export const DESCRIPTION_CHAR_LIMIT = 200 as const;

/* e.g. 2024-01 */
export const TIMEFRAME_FORMAT = "yyyy-MM" as const;
export const TIMEFRAME_KEY = "t" as const;

export const locales = [
  { locale: "en", flag: "uk" },
  { locale: "de", flag: "de" },
  { locale: "es", flag: "es" },
  { locale: "hu", flag: "hu" },
] as const;

export const SETUP_STEPS = [
  {
    title: "setup-step.monthly-budget.title",
    description: "setup-step.monthly-budget.description",
  },
  {
    title: "setup-step.add-initial-balance.title",
    description: "setup-step.add-initial-balance.description",
  },
  {
    title: "setup-step.add-initial-transactions.title",
    description: "setup-step.add-initial-transactions.description",
  },
  {
    title: "setup-step.review-and-finish.title",
    description: "setup-step.review-and-finish.description",
  },
] as const;

export const LOADING_TIPS = [
  {
    type: "did-you-know",
    text: "tip.budget",
  },
  {
    type: "fun-fact",
    text: "tip.tracking",
  },
  {
    type: "pro-tip",
    text: "tip.statements",
  },
  {
    type: "did-you-know",
    text: "tip.automating",
  },
  {
    type: "pro-tip",
    text: "tip.impulse",
  },
  {
    type: "pro-tip",
    text: "tip.recurring",
  },
  {
    type: "did-you-know",
    text: "tip.emergency",
  },
] as const;

export const TRANSACTION_TYPES = [
  "income",
  "expense",
  "investment",
  "savings",
] as const;

export const ROUTES = [
  {
    path: "/home",
    name: "home",
    icon: HomeIcon,
  },
  {
    path: "/statistics",
    name: "statistics",
    icon: LineChartIcon,
  },
  {
    path: "/savings",
    name: "savings",
    icon: PiggyBankIcon,
  },
] as const;

export const DEFAULT_TOAST_OPTIONS: ExternalToast = {
  position: "bottom-center",
} as const;

export const DEFAULT_CATEGORIES = {
  income: [
    "bonus",
    "sales",
    "salary",
    "lottery",
    "interest",
    "allowance",
    "dividends",
    "scholarship",
    "gifts-received",
  ],
  "food-and-dining": [
    "snacks",
    "takeout",
    "delivery",
    "groceries",
    "restaurant",
    "drinks-and-alcohol",
  ],
  housing: [
    "rent",
    "repairs",
    "mortgage",
    "furnitures",
    "home-insurance",
    "home-maintenance",
  ],
  transportation: [
    "fuel",
    "scooter-rental",
    "bicycle-rental",
    "car-payment",
    "car-insurance",
    "car-maintenance",
    "public-transport",
    "taxi-and-ride-sharing",
  ],
  utilities: [
    "gas",
    "water-bill",
    "internet-bill",
    "cable-tv-bill",
    "electricity-bill",
    "mobile-phone-bill",
  ],
  "health-and-wellness": [
    "yoga",
    "medications",
    "dental-care",
    "vision-care",
    "doctor-visits",
    "gym-membership",
    "health-insurance",
    "fitness-activities",
  ],
  entertainment: [
    "events",
    "theater",
    "concerts",
    "video-games",
    "art-and-crafts",
    "movies-and-shows",
    "amusement-parks",
    "books-and-magazines",
  ],
  education: [
    "books",
    "courses",
    "tuition-fees",
    "exams-and-tests",
    "school-supplies",
  ],
  "personal-care": [
    "makeup",
    "skincare",
    "haircuts",
    "bath-and-body",
    "salon-services",
    "hygiene-products",
  ],
  shopping: [
    "shoes",
    "gifts",
    "gadgets",
    "clothing",
    "accessories",
    "electronics",
  ],
  travel: [
    "cruises",
    "flights",
    "car-rental",
    "travel-gear",
    "accommodation",
    "tours-and-activities",
  ],
  "bills-and-payments": [
    "loan-payment",
    "subscriptions",
    "utilities-bill",
    "maintenance-fees",
    "credit-card-payment",
  ],
  miscellaneous: [
    "investments",
    "miscellaneous",
    "gifts-and-donations",
    "learning-and-development",
  ],
} as const;

export const CATEGORIES_VALUES = Object.values(DEFAULT_CATEGORIES).flat();
