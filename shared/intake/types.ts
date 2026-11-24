// Shared intake types — used by both the portfolio frontend and the Worker.

export type VerifyReason = "syntax" | "disposable" | "no_mx";

export type RejectReason =
  | "moderation"
  | "gibberish"
  | "too_short"
  | "too_long"
  | "bad_url"
  | "too_many_links"
  | "missing"
  | "bad_option"
  | "spam"
  | "relay";

export interface IntakeAnswers {
  name: string;
  email: string;
  project_type: string;
  project_details: string;
  design_preferences: string; // "" allowed → rendered as "—"
  timeline: string;
  budget: string;
  extra_notes: string; // "" allowed → rendered as "—"
}

export interface VerifyEmailResponse {
  ok: boolean;
  reason?: VerifyReason;
}

export interface IntakeResponse {
  ok: boolean;
  reason?: RejectReason | VerifyReason;
  field?: keyof IntakeAnswers | "_gotcha";
}
