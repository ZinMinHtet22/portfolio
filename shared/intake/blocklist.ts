// Shared NSFW / abuse blocklist — one list used by frontend AND Worker.
// Matching is normalised first (lowercase, leetspeak decoded, repeated letters
// collapsed) so `s3x` and `seeex` don't slip through. Both the input and every
// blocklist entry go through the same normaliser, then token/phrase matching
// with word boundaries (so "class" never matches "ass").

const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "8": "b",
  "9": "g",
  "@": "a",
  $: "s",
};

/** lowercase → decode leetspeak (digits, @, $) → non-alphanumerics become
 *  spaces → collapse letter runs of 2+ to 1 → collapse whitespace.
 *  `!`/`+` are deliberately NOT mapped: "fuck!" must stay "fuck". */
export function normalizeText(input: string): string {
  let s = input.toLowerCase();
  s = s.replace(/[01345789@$]/g, (ch) => LEET_MAP[ch] ?? ch);
  s = s.replace(/[^a-z0-9]+/g, " ");
  s = s.replace(/([a-z0-9])\1+/g, "$1");
  return s.trim().replace(/\s+/g, " ");
}

// Curated list: profanity, sexual/explicit terms, slurs, common abuse.
// Kept deliberately professional-scope: this filters abusive input, not opinions.
const WORDS = [
  // profanity
  "fuck", "fucking", "fucked", "fucker", "shit", "shitty", "bullshit",
  "bitch", "bastard", "asshole", "assholes", "dickhead", "prick",
  "wanker", "twat", "cunt", "dick", "cock", "pricks",
  // sexual / explicit
  "sex", "sexy", "porn", "porno", "nude", "naked", "boobs", "tits",
  "vagina", "penis", "pussy", "whore", "slut", "handjob", "blowjob",
  "masturbate", "masturbating", "jerkoff", "orgasm",
  // slurs
  "nigger", "nigga", "faggot", "fag", "retard", "retarded",
  "chink", "spic", "kike",
  // abuse / threats
  "rape", "rapist", "kill yourself", "kys",
  // spam bait
  "viagra", "casino", "lottery winner",
];

// Every entry goes through the SAME normaliser as the input, so "kill" (raw)
// matches the input's collapsed "kil", "boobs" matches "bobs", etc.
// Known honest limit of both-sides collapsing: an innocent word that collapses
// onto an entry (e.g. "bobs") also matches — acceptable for a portfolio intake.
const NORMALIZED = WORDS.map(normalizeText).filter(Boolean);

const PHRASES = NORMALIZED.filter((w) => w.includes(" "));
const TOKENS = new Set(NORMALIZED.filter((w) => !w.includes(" ")));

export interface ModerationResult {
  ok: boolean;
  matched?: string;
}

/** Normalise `input`, then look for any blocklist hit (word-boundary tokens
 *  plus whole-phrase matches). Returns the matched entry for logging. */
export function moderateText(input: string): ModerationResult {
  const normalized = normalizeText(input);
  if (!normalized) return { ok: true };

  const tokens = normalized.split(" ");

  for (const token of tokens) {
    if (TOKENS.has(token)) return { ok: false, matched: token };
  }
  for (const phrase of PHRASES) {
    if (normalized.includes(phrase)) return { ok: false, matched: phrase };
  }
  return { ok: true };
}
