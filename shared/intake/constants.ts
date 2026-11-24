// Chip options + validation limits shared by frontend and Worker.
// The Worker validates incoming chips against these lists (never trust the client).

export const PROJECT_TYPES = [
  "Web app",
  "Online store",
  "Business / portfolio site",
  "Mobile app",
  "Something else",
] as const;

export const TIMELINES = [
  "ASAP",
  "Within a month",
  "2–3 months",
  "Flexible",
] as const;

export const BUDGETS = [
  "Under $500",
  "$500–$1,500",
  "$1,500–$5,000",
  "$5,000+",
  "Not sure yet",
] as const;

export const LENGTH_CAPS = {
  name: 100,
  project_details: 2000,
  design_preferences: 1000,
  extra_notes: 1000,
  email: 254,
} as const;

export const DETAILS_MIN_LENGTH = 10;
export const MAX_LINKS_PER_FIELD = 3;
export const TOTAL_BODY_CAP = 20 * 1024; // ~20 KB Worker body cap
