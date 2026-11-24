"""Generate the complete bot work-completion report (Word .docx)."""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from generate_intake_doc import (  # noqa: E402
    ROOT, ACCENT, DARK, MUTED, Document, Inches, Pt, WD_ALIGN_PARAGRAPH,
    add_field, add_footer, add_header, caption, code, h, para, setup_styles,
    table, bullets,
)

OUT = Path(r"D:\Documents\Projects\Portfolio\Documents") / "Intake-Chatbot-Work-Report.docx"


def build():
    doc = Document()
    setup_styles(doc)
    s = doc.sections[0]
    s.top_margin = Inches(0.85)
    s.bottom_margin = Inches(0.85)
    s.left_margin = Inches(0.9)
    s.right_margin = Inches(0.9)
    add_header(doc)
    add_footer(doc)

    doc.core_properties.title = "Client Intake Chatbot — Work Completion Report"
    doc.core_properties.author = "Zin Min Htet"
    doc.core_properties.subject = "Full record of bot implementation, testing, deployment and collateral"

    # Title
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(60)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("CLIENT INTAKE CHATBOT")
    r.bold = True
    r.font.size = Pt(28)
    r.font.color.rgb = ACCENT

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Work Completion Report")
    r.font.size = Pt(19)
    r.font.color.rgb = DARK

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(16)
    r = p.add_run("Everything completed for the bot — design, code, verification, deployment, collateral")
    r.font.size = Pt(11)
    r.font.color.rgb = MUTED

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(22)
    r = p.add_run("Zin Min Htet · Portfolio\nVersion 1.0 · 24 November 2026\nStatus: Complete, deployed, live-tested")
    r.font.size = Pt(11)
    r.font.color.rgb = ACCENT

    doc.add_picture(str(ROOT / "public" / "intake-bot.png"), width=Inches(1.2))
    doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    caption(doc, "Deployed Telegram bot avatar")

    doc.add_page_break()

    h(doc, "Contents", 1)
    add_field(doc.add_paragraph(), 'TOC \\o "1-3" \\h \\z \\u')
    caption(doc, "Right-click the field and choose Update Field in Word if it appears blank.")
    doc.add_page_break()

    # 1
    h(doc, "1. Scope and working constraints", 1)
    para(
        doc,
        "This report records all work completed for the portfolio client intake chatbot, from the written "
        "plan through code, local verification, production deployment, live testing, and supporting media. "
        "The source of truth was C:\\Users\\My PC\\Downloads\\portfolio-intake-chatbot-plan.md (241 lines, sections 1–16).",
    )
    h(doc, "1.1 Constraints followed", 2)
    bullets(doc, [
        "No git commit and no push at any point.",
        "Production deployment only through: npx wrangler pages deploy out --project-name jeffery-portfolio --branch main --commit-dirty=true.",
        "Omitting --branch was avoided because it targets master, which is preview only.",
        "Clean build every time: delete out/, then run npx next build.",
        "No new project dependencies; existing Next.js, React, Tailwind and Cloudflare tooling only.",
        "Verification limited to https://jeffery-portfolio.pages.dev/ with screenshot evidence for visual claims.",
        "Existing hero, wordmark, marquee, meta row and How I Work section left untouched.",
        "Design tokens from DESIGN.md followed, including accent #0099ff and rounded surfaces.",
    ])
    h(doc, "1.2 Decisions made during implementation", 2)
    table(doc, ["Decision", "Outcome"], [
        ["Production branch is main", "All Pages deployments targeted main explicitly"],
        ["Worker lives in intake-worker/ with its own wrangler.toml", "Independent Worker deploy; not part of the Next.js build"],
        ["Shared code in shared/intake/ imported by both browser and Worker", "One source of truth for chips, validation, moderation and brief format"],
        ["Build first, secrets at end", "All code and tests finished before asking for Telegram credentials"],
        ["Chip steps stay chips-only", "Worker validates chip membership; no free text on steps 1, 4 or 5"],
        ["Worker 4xx is a rejection; 5xx/network is infrastructure", "4xx sends nothing; 5xx allows Formspree-only with [Unverified] subject"],
        ["Email MX failure is infrastructure, not rejection", "Browser proceeds with emailVerified = skipped and a clear brief line"],
        ["No real submissions during development", "All pre-deploy tests used local dev or mocked inputs; one live test after deploy"],
        ["Temporary dry-run code removed after tests", "No test-only flags remain in the shipped source"],
    ], widths=[4.0, 5.1])

    # 2
    h(doc, "2. Workstream summary", 1)
    table(doc, ["Workstream", "Result", "Evidence"], [
        ["Requirements analysis", "Full 241-line plan read and mapped", "Plan file sections 1–16"],
        ["Shared validation module", "Six modules written and unit-tested", "shared/intake/*.ts; 35 passing tests"],
        ["Cloudflare Worker", "Gatekeeper + Telegram relay implemented", "intake-worker/src/index.ts; 12 endpoint cases"],
        ["Intake chat UI", "Eight-step flow, review, edit, resume, strikes", "src/components/contact/IntakeChat.tsx"],
        ["Contact shell integration", "Mode tabs and /contact entry point", "ContactPanel, ContactTrigger, contact page"],
        ["Moderation and verification", "Client + authoritative Worker checks", "MX suite 8/8; shared suite 35/35"],
        ["Defect remediation", "Seven real defects found and fixed", "Section 7 of this report"],
        ["Deployment", "Worker and site deployed to production", "Worker URL; Pages deployment 645cc8ff"],
        ["Live verification", "Formspree email + Telegram message + file confirmed", "Owner confirmation; success screen capture"],
        ["Support collateral", "Avatar, demo video, workflow doc, this report", "Section 9 of this report"],
    ], widths=[1.9, 4.0, 3.2])

    # 3
    h(doc, "3. Requirements implemented", 1)
    table(doc, ["Plan section", "Requirement", "Status"], [
        ["§3", "Static Next.js site plus Worker gatekeeper; no second floating widget", "Done"],
        ["§4", "Eight-step scripted flow, chips, skips, progress label, typing delay", "Done"],
        ["§4", "Review card with per-field Edit and return to review", "Done"],
        ["§4", "Success screen with .md download and 24–48 hour reply expectation", "Done"],
        ["§4", "sessionStorage resume; cleared on success or restart", "Done"],
        ["§5", "Worker-first submit, then Formspree; reason-based rejections", "Done"],
        ["§6", "Single Markdown brief template used in four places", "Done"],
        ["§7", "Worker routes /verify-email and /intake; CORS allowlist; Bot API relay", "Done"],
        ["§8", "Environment variables and Worker secrets configured", "Done"],
        ["§11.1", "Curated blocklist with normalisation and three strikes", "Done"],
        ["§11.2", "Disposable-domain block, privacy relays allowed", "Done"],
        ["§11.3", "Server-side MX lookup with null-MX rejection", "Done"],
        ["§11.4", "Length caps, anti-gibberish, URL and link limits", "Done"],
        ["§11.5", "Verification scope documented; OTP parked for v2", "Done"],
        ["§12", "Secrets only in Worker; honeypot; no tracking", "Done"],
        ["§13", "Accessible buttons, focus states, aria-live, reduced motion", "Done"],
        ["§14", "Dry-run test set, browser click-through, lint/build, one live test", "Done"],
        ["§16", "Full build checklist closed", "Done"],
    ], widths=[1.0, 6.6, 1.5])

    # 4
    h(doc, "4. Files created and modified for the bot", 1)
    table(doc, ["File", "Change"], [
        ["shared/intake/types.ts", "Shared answer and verification types"],
        ["shared/intake/constants.ts", "Chip options, length caps, DETAILS_MIN_LENGTH, link cap"],
        ["shared/intake/blocklist.ts", "Curated blocklist plus text normalisation and matching"],
        ["shared/intake/disposable.ts", "Disposable email domain list and lookup"],
        ["shared/intake/validate.ts", "Email syntax, local email checks, text checks, gibberish, URL rules"],
        ["shared/intake/brief.ts", "Markdown brief compiler and filename helper"],
        ["intake-worker/wrangler.toml", "Worker name and configuration"],
        ["intake-worker/src/index.ts", "Routes, CORS, MX check, full re-validation, Telegram relay"],
        ["src/components/contact/IntakeChat.tsx", "Complete intake conversation UI and flow logic"],
        ["src/components/contact/ContactPanel.tsx", "Message/Project intake tabs; renders IntakeChat; Message mode preserved"],
        ["src/components/contact/ContactTrigger.tsx", "mode prop to open panel directly in intake mode"],
        ["src/app/contact/page.tsx", "Start a project intake entry card"],
        ["tsconfig.json", "@shared/* path alias"],
        [".env.local", "NEXT_PUBLIC_INTAKE_WORKER_URL set to deployed Worker URL"],
        [".env.example", "Worker URL variable documented"],
        ["public/intake-bot.svg / .png", "Bot avatar source and 512×512 PNG"],
        ["docs/generate_intake_doc.py", "Generator for the workflow document"],
        ["docs/generate_intake_work_report.py", "Generator for this report"],
        ["demo-capture/", "Step screenshots, title/end cards, QC frames"],
        ["intake-workflow-demo.mp4", "30-second captioned walkthrough video"],
        ["Intake-Chatbot-Workflow.docx", "Workflow design and detailed technical explanation"],
        ["Intake-Chatbot-Work-Report.docx", "This completion report"],
    ], widths=[4.0, 5.1], font_size=8.5)

    # 5
    h(doc, "5. Implementation detail", 1)
    h(doc, "5.1 Shared validation module", 2)
    bullets(doc, [
        "One module set is imported by the browser via @shared/* and by the Worker via relative paths.",
        "Chip lists cover project type, timeline and budget; all three are membership-validated on both sides.",
        "Length caps: name 100, project details 2,000, design preferences 1,000, extra notes 1,000; Worker body cap about 20 KB.",
        "Blocklist normalisation lowercases, decodes leetspeak digits, separates punctuation, collapses repeated letters, and compares normalised entries against normalised input with word/phrase boundaries.",
        "Gibberish detection rejects all-identical token answers and answers with more than 60 percent repeated characters or an excessively low unique-token ratio.",
        "URL validation requires any token beginning with http to parse as an absolute http(s) URL and enforces a maximum of three links in the design field.",
        "The brief compiler produces the same Markdown document for Formspree, Telegram, visitor download, and mailto fallback.",
    ])

    h(doc, "5.2 Cloudflare Worker", 2)
    bullets(doc, [
        "POST /verify-email checks syntax, disposable domain and MX at step 8.",
        "POST /intake repeats every check server-side, including moderation of all text fields, chip membership, honeypot, length limits and total body size.",
        "MX lookup uses Cloudflare DNS-over-HTTPS with application/dns-json; real MX passes, implicit MX via A/AAAA passes, null MX and dead domains reject, DNS failure is infrastructure.",
        "CORS allows only the production pages.dev origin and localhost:3000, with OPTIONS preflight returning 204.",
        "Telegram delivery uses sendMessage for the summary and sendDocument for the Markdown brief.",
        "Responses expose only generic reason codes; no token, stack trace, or internal detail is returned.",
        "Secrets were uploaded with wrangler secret put and never written to source files.",
    ])

    h(doc, "5.3 Intake chat UI", 2)
    bullets(doc, [
        "Eight scripted steps with a separate greeting, 400 ms typing delay, chip quick replies, text inputs, optional Skip, and Enter/Shift+Enter handling.",
        "Email step calls the Worker and maps syntax, disposable and no_mx reasons to distinct polite re-ask messages.",
        "Review card offers Edit per field; editing skips the greeting and returns straight to review.",
        "Three moderation strikes end the flow with a link to the Message tab; progress is cleared.",
        "Refresh-resume uses sessionStorage with a hydration guard so saved progress cannot be overwritten on mount.",
        "Submit order is Worker first, Formspree second; Worker 4xx blocks all delivery; Worker 5xx or network failure allows Formspree-only with [Unverified] subject and a mailto fallback.",
        "Success screen offers the .md download and a support link; saved progress is cleared.",
    ])

    h(doc, "5.4 Contact shell", 2)
    para(
        doc,
        "The existing ContactPanel gained a Message / Project intake tablist. ContactTrigger received an optional "
        "mode prop, and the /contact page gained a card that opens the panel directly in intake mode. The "
        "original message form, its styling, and its behaviour were left working and unchanged.",
    )

    # 6
    h(doc, "6. Telegram setup completed", 1)
    table(doc, ["Task", "Result"], [
        ["Bot created with @BotFather", "@zin_portfolio_intake_bot"],
        ["Bot token issued", "Stored only as Worker secret TELEGRAM_BOT_TOKEN"],
        ["Owner chat ID obtained", "Stored as Worker secret TELEGRAM_CHAT_ID"],
        ["/start sent to the bot", "Owner can receive direct Bot API messages"],
        ["Profile photo", "public/intake-bot.png set manually by the owner through BotFather"],
        ["Worker deployed", "https://zin-intake-worker.alden-god-mdy.workers.dev"],
        ["Live Telegram delivery", "Summary message and Markdown brief file confirmed by owner"],
    ], widths=[3.3, 5.8])
    para(
        doc,
        "The bot delivers intake submissions but does not process ordinary inbound messages. No Telegram "
        "webhook exists in v1; adding inbound handling would be a separate Worker route.",
    )

    # 7
    h(doc, "7. Verification campaign", 1)
    h(doc, "7.1 Local and static checks", 2)
    table(doc, ["Check", "Result"], [
        ["Shared-module unit tests", "35 of 35 pass: moderation, leetspeak, gibberish, email syntax, disposable domains, field rules, URLs, brief template"],
        ["Worker endpoint cases against wrangler dev", "12 pass: gmail accepted; syntax, disposable, no-MX, empty, spam, bad chip, bad URL, too many links, missing name all 422; valid intake 502 relay without secrets; CORS correct"],
        ["MX branch suite with mocked DNS", "8 of 8 pass: real MX, null MX variations, implicit MX via A/AAAA, no address record, NXDOMAIN, DNS failure"],
        ["Browser click-through", "Full eight-step flow, both skips, Edit-and-return, refresh-resume, 3-strike end, gatekeeper order, mailto fallback"],
        ["Type check", "npx tsc --noEmit exits 0"],
        ["Lint", "npx eslint src shared intake-worker/src exits 0"],
        ["Clean build", "out/ deleted, npx next build succeeds, 18 static pages generated"],
        ["Build artefact greps", "Contact intake tab and entry card present; worker URL in bundle; hero scroll button and How I work intact"],
        ["Live Worker smoke test", "/verify-email gmail 200, junk 422, CORS preflight 204 with correct ACAO"],
    ], widths=[2.4, 6.7], font_size=8.5)

    h(doc, "7.2 Live test", 2)
    table(doc, ["Item", "Detail"], [
        ["Date", "24 November 2026"],
        ["Site", "https://jeffery-portfolio.pages.dev/contact"],
        ["Test email", "ryuuprime25@gmail.com"],
        ["Answers", "Clearly marked TEST web-app booking brief with timeline and budget chips"],
        ["Result", "Success screen: “Thanks — your brief is on its way.” plus Download my brief (.md)"],
        ["Formspree", "Owner confirmed test email arrived in inbox"],
        ["Telegram", "Owner confirmed summary message and brief file arrived from the bot"],
        ["Side effects", "One real test email and one real Telegram delivery; no further submissions performed"],
    ], widths=[1.9, 7.2])

    h(doc, "7.3 Defects found and fixed", 2)
    table(doc, ["Defect", "Fix"], [
        ["DoH null MX “0 .” treated as a real MX", "Strip numeric preference before comparing the exchange; all null MX records reject"],
        ["“FUCK!” bypassed moderation because ! mapped to i", "Removed ! and + from leet map so punctuation becomes a separator"],
        ["Blocklist phrases such as “kill yourself” missed", "Normalise the blocklist entries with the same function used for input"],
        ["Gibberish check missed two identical tokens and exact ratio boundary", "Reject any all-identical multi-token answer and use <= 0.4 unique-token threshold"],
        ["Editing step 1 repeated the welcome greeting", "Split INTRO from question; intro only on fresh start or restart"],
        ["Mount-time persistence clobbered saved progress before resume", "Added hydrated state guard to the persistence effect"],
        ["“http//broken-link” passed URL validation", "Any token beginning with http must parse as an absolute URL"],
    ], widths=[4.5, 4.6], font_size=8.5)
    para(
        doc,
        "Two further issues were test-script mistakes rather than application defects: a payload with only two "
        "links for the four-link case, and a payload with a valid name for the missing-name case. Both were "
        "corrected and then passed.",
    )

    # 8
    h(doc, "8. Deployment record", 1)
    table(doc, ["Step", "Outcome"], [
        ["Worker secrets", "TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID uploaded with wrangler secret put"],
        ["Worker deploy", "npx wrangler deploy -c intake-worker/wrangler.toml"],
        ["Worker URL", "https://zin-intake-worker.alden-god-mdy.workers.dev"],
        ["Worker version", "07c175f7-c8f1-4537-b7f9-70695fc8193e"],
        ["Site environment", "NEXT_PUBLIC_INTAKE_WORKER_URL set in .env.local, Formspree ID retained"],
        ["Site build", "out/ removed, clean next build, worker URL present in emitted bundle"],
        ["Pages deploy", "npx wrangler pages deploy out --project-name jeffery-portfolio --branch main --commit-dirty=true"],
        ["Deployment URL", "https://645cc8ff.jeffery-portfolio.pages.dev"],
        ["Apex verification", "Production apex serves new intake tab, entry card, worker bundle, and untouched hero markers"],
        ["Git state", "No commit, no push; working tree left dirty by design"],
    ], widths=[2.3, 6.8])

    h(doc, "8.1 Cleanup performed", 2)
    bullets(doc, [
        "Temporary .env.development.local used for local click-through removed.",
        "Temporary _mxtest bundle and test scripts removed.",
        "Local next dev and wrangler dev servers stopped.",
        "Temporary SVG preview server stopped and preview browser tab closed.",
        "No dry-run or test-only code remains in the shipped source.",
    ])

    # 9
    h(doc, "9. Collateral produced", 1)
    table(doc, ["Artefact", "Path / detail"], [
        ["Workflow document", "D:\\portfolio\\Intake-Chatbot-Workflow.docx"],
        ["This report", "D:\\portfolio\\Intake-Chatbot-Work-Report.docx"],
        ["Demo video", "D:\\portfolio\\intake-workflow-demo.mp4 — 30 s, 560×840, H.264, no audio"],
        ["Source frames", "D:\\portfolio\\demo-capture\\"],
        ["Bot avatar PNG", "D:\\portfolio\\public\\intake-bot.png — 512×512"],
        ["Bot avatar source", "D:\\portfolio\\public\\intake-bot.svg"],
        ["Document generators", "D:\\portfolio\\docs\\generate_intake_doc.py and generate_intake_work_report.py"],
    ], widths=[2.3, 6.8])
    para(
        doc,
        "The demo video was assembled from real live-site screenshots into a captioned slideshow. It is not a "
        "continuous real-time screen recording because no screen recorder was available in the working environment.",
    )

    # 10
    h(doc, "10. Current state and known limitations", 1)
    table(doc, ["Area", "State"], [
        ["Intake flow", "Live and verified end to end on the production domain"],
        ["Telegram", "Summary and .md file delivered; inbound messages not handled in v1"],
        ["Email archive", "Formspree live and confirmed"],
        ["Verification", "Syntax, disposable, MX and null-MX checks active; inbox ownership (OTP) not implemented"],
        ["Moderation", "Deterministic curated wordlist; cannot detect novel or subtle phrasing"],
        ["Spam hardening", "Client checks, server checks, honeypot, Formspree filtering; Turnstile available as a future step"],
        ["Cost", "No new paid services; existing free tiers only"],
        ["Code changes", "All complete; no commit or push"],
    ], widths=[2.0, 7.1])

    h(doc, "10.1 Recommended next actions", 2)
    bullets(doc, [
        "Monitor the first real client submissions for deliverability and wording quality.",
        "Rotate the Telegram token with @BotFather /revoke and wrangler secret put if it is ever exposed.",
        "If Telegram spam appears, add Cloudflare Turnstile to the Worker.",
        "If a custom sending domain becomes available, add OTP email verification between steps 8 and 9.",
        "If inbound Telegram messages are wanted, add a webhook Worker; no chat-flow change is needed.",
    ])

    h(doc, "Appendix — Verification commands", 1)
    code(
        doc,
        "npx tsc --noEmit\n"
        "npx eslint src shared intake-worker/src --ext .ts,.tsx\n"
        "rm -rf out && npx next build\n"
        "npx wrangler secret put TELEGRAM_BOT_TOKEN -c intake-worker/wrangler.toml\n"
        "npx wrangler secret put TELEGRAM_CHAT_ID -c intake-worker/wrangler.toml\n"
        "npx wrangler deploy -c intake-worker/wrangler.toml\n"
        "npx wrangler pages deploy out --project-name jeffery-portfolio --branch main --commit-dirty=true",
    )

    doc.save(OUT)
    print(f"saved {OUT}")


if __name__ == "__main__":
    build()
