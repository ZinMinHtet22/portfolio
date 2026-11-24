"""Generate the intake-chatbot workflow document (Word .docx)."""
from pathlib import Path
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(r"D:\portfolio")
OUT = Path(r"D:\Documents\Projects\Portfolio\Documents") / "Intake-Chatbot-Workflow-Public.docx"
ACCENT = RGBColor(0x00, 0x77, 0xBB)
DARK = RGBColor(0x11, 0x18, 0x20)
MUTED = RGBColor(0x55, 0x5F, 0x6A)


def shade(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill)
    tcPr.append(shd)


def set_repeat_table_header(row):
    trPr = row._tr.get_or_add_trPr()
    tblHeader = OxmlElement("w:tblHeader")
    tblHeader.set(qn("w:val"), "true")
    trPr.append(tblHeader)


def add_field(paragraph, instr):
    run = paragraph.add_run()
    fldChar = OxmlElement("w:fldChar")
    fldChar.set(qn("w:fldCharType"), "begin")
    run._r.append(fldChar)
    run2 = paragraph.add_run()
    instrText = OxmlElement("w:instrText")
    instrText.set(qn("xml:space"), "preserve")
    instrText.text = instr
    run2._r.append(instrText)
    run3 = paragraph.add_run()
    fldChar2 = OxmlElement("w:fldChar")
    fldChar2.set(qn("w:fldCharType"), "separate")
    run3._r.append(fldChar2)
    run4 = paragraph.add_run("Right-click to update fields")
    run4.italic = True
    run4.font.size = Pt(9)
    run5 = paragraph.add_run()
    fldChar3 = OxmlElement("w:fldChar")
    fldChar3.set(qn("w:fldCharType"), "end")
    run5._r.append(fldChar3)


def table(doc, headers, rows, widths=None, font_size=9):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    if widths:
        for row in t.rows:
            for i, cell in enumerate(row.cells):
                cell.width = Inches(widths[i])
    hdr = t.rows[0]
    set_repeat_table_header(hdr)
    for i, h in enumerate(headers):
        cell = hdr.cells[i]
        cell.text = ""
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(font_size)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        shade(cell, "006699")
    for row_data in rows:
        cells = t.add_row().cells
        if widths:
            for i, cell in enumerate(cells):
                cell.width = Inches(widths[i])
        for i, value in enumerate(row_data):
            cells[i].text = ""
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(str(value))
            r.font.size = Pt(font_size)
    doc.add_paragraph()
    return t


def bullets(doc, items, style="List Bullet"):
    for item in items:
        p = doc.add_paragraph(style=style)
        p.paragraph_format.space_after = Pt(3)
        p.add_run(item)


def code(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.15)
    p.paragraph_format.space_after = Pt(8)
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:fill"), "F2F5F7")
    pPr.append(shd)
    r = p.add_run(text)
    r.font.name = "Consolas"
    r.font.size = Pt(8.5)
    r.font.color.rgb = DARK
    return p


def caption(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(text)
    r.italic = True
    r.font.size = Pt(9)
    r.font.color.rgb = MUTED


def h(doc, text, level=1):
    p = doc.add_paragraph(style=f"Heading {level}")
    p.add_run(text)
    return p


def para(doc, text, bold_lead=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    if bold_lead:
        r = p.add_run(bold_lead)
        r.bold = True
        p.add_run(text)
    else:
        p.add_run(text)
    return p


def setup_styles(doc):
    normal = doc.styles["Normal"]
    normal.font.name = "Arial"
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = DARK
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.15

    title = doc.styles["Title"]
    title.font.name = "Arial"
    title.font.size = Pt(30)
    title.font.bold = True
    title.font.color.rgb = DARK

    for name, size, color in [
        ("Heading 1", 17, ACCENT),
        ("Heading 2", 13, ACCENT),
        ("Heading 3", 11, DARK),
    ]:
        st = doc.styles[name]
        st.font.name = "Arial"
        st.font.size = Pt(size)
        st.font.bold = True
        st.font.color.rgb = color
        st.paragraph_format.space_before = Pt(14)
        st.paragraph_format.space_after = Pt(6)


def add_footer(doc):
    footer = doc.sections[0].footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run("Client Intake Chatbot — Workflow Design & Technical Explanation   |   Page ")
    add_field(p, "PAGE")
    p.add_run(" of ")
    add_field(p, "NUMPAGES")


def add_header(doc):
    header = doc.sections[0].header
    p = header.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p.add_run("Portfolio Project")
    r.font.size = Pt(9)
    r.font.color.rgb = MUTED


def build():
    doc = Document()
    setup_styles(doc)
    section = doc.sections[0]
    section.top_margin = Inches(0.85)
    section.bottom_margin = Inches(0.85)
    section.left_margin = Inches(0.9)
    section.right_margin = Inches(0.9)
    add_header(doc)
    add_footer(doc)

    doc.core_properties.title = "Client Intake Chatbot — Workflow Design & Technical Explanation"
    doc.core_properties.author = "Portfolio Team"
    doc.core_properties.subject = "Portfolio client intake chatbot: architecture, workflow, verification, deployment"

    # ---- Title page ----
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(70)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("CLIENT INTAKE CHATBOT")
    r.bold = True
    r.font.size = Pt(28)
    r.font.color.rgb = ACCENT

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Workflow Design & Technical Explanation")
    r.font.size = Pt(17)
    r.font.color.rgb = DARK

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(18)
    r = p.add_run("Portfolio Website")
    r.font.size = Pt(12)
    r.font.color.rgb = MUTED

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Version 1.0 · 24 November 2026 · Status: Deployed and verified")
    r.font.size = Pt(10)
    r.font.color.rgb = MUTED


    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(40)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(
        "Live site: https://<project>.pages.dev/contact\n"
        "Worker: https://<worker>.<account>.workers.dev"
    )
    r.font.size = Pt(10)
    r.font.color.rgb = ACCENT

    doc.add_page_break()

    # ---- TOC ----
    h(doc, "Contents", 1)
    toc_p = doc.add_paragraph()
    add_field(toc_p, 'TOC \\o "1-3" \\h \\z \\u')
    caption(doc, "If the list above looks empty, right-click it and choose Update Field in Word.")
    doc.add_page_break()

    # ---- 1 ----
    h(doc, "1. Executive summary", 1)
    para(
        doc,
        "The client intake chatbot converts a portfolio visit into a structured, qualified project lead. "
        "A scripted conversation collects eight answers, validates them in the browser, re-validates them "
        "authoritatively in a Cloudflare Worker, compiles a Markdown project brief, and delivers that brief "
        "to the owner through two independent channels: Telegram for instant notification and Formspree for a "
        "permanent email archive. The visitor leaves with a downloadable copy of the same brief.",
    )
    para(
        doc,
        "The system is intentionally rule-based. There is no AI model, no database, no account system, no "
        "tracking, and no monthly service cost. The only persistent state is the visitor's own progress in "
        "sessionStorage, cleared on success or explicit restart.",
    )
    h(doc, "1.1 Design goals and non-goals", 2)
    table(
        doc,
        ["Goals", "Non-goals"],
        [
            [
                "Consistent, comparable project enquiries",
                "No AI or free-form conversational agent",
            ],
            [
                "Reject fake, disposable, abusive, and spam input before delivery",
                "No general support bot, FAQ bot, or live chat",
            ],
            [
                "Instant owner notification plus durable email archive",
                "No CRM, database, or analytics pipeline",
            ],
            [
                "Zero running cost and minimal maintenance",
                "No new floating widget; no second panel system",
            ],
            [
                "Accessible, token-matched interface inside the existing ContactPanel",
                "No inbox-ownership (OTP) verification in v1",
            ],
        ],
        widths=[4.6, 4.5],
    )

    # ---- 2 ----
    h(doc, "2. Workflow design", 1)
    h(doc, "2.1 Entry points", 2)
    bullets(
        doc,
        [
            "ContactPanel mode switch — “Message” (the existing form, default) or “Project intake”.",
            "A dedicated “Start a project intake” card on /contact that opens the same panel directly in intake mode.",
            "Both paths use the existing ContactTrigger and ContactPanel components; no separate floating widget was added.",
        ],
    )

    h(doc, "2.2 Conversation script", 2)
    para(
        doc,
        "Order follows a low-friction-first rule: project context first, contact details last. "
        "Each step shows a progress label (“Step N of 8”) and uses quick-reply chips where options exist.",
    )
    table(
        doc,
        ["Step", "Question / action", "Input", "Required", "Validation"],
        [
            ["1", "What kind of project is it?", "Chips: Web app · Online store · Business / portfolio site · Mobile app · Something else", "Yes", "Chip membership"],
            ["2", "Tell me about it — what should it do? List the must-have features.", "Free text", "Yes", "Moderation, gibberish, min 10 chars, max 2,000"],
            ["3", "Any design style you like, or reference sites/links?", "Free text + Skip", "No", "Moderation, max 1,000, valid URLs, max 3 links"],
            ["4", "When do you need it?", "Chips: ASAP · Within a month · 2–3 months · Flexible", "Yes", "Chip membership"],
            ["5", "What budget have you set aside for this?", "Chips: Under $500 · $500–$1,500 · $1,500–$5,000 · $5,000+ · Not sure yet", "Yes", "Chip membership"],
            ["6", "Anything else I should pass on?", "Free text + Skip", "No", "Moderation, max 1,000"],
            ["7", "Your name?", "Free text", "Yes", "Moderation, max 100"],
            ["8", "And the best email to reach you?", "Email", "Yes", "Syntax, disposable block, MX check through the Worker"],
            ["9", "Review card with Edit per field", "Send my brief · Start over", "—", "Gatekeeper-ordered submit; success screen + .md download"],
        ],
        widths=[0.5, 2.5, 2.8, 0.7, 2.6],
        font_size=8.5,
    )

    h(doc, "2.3 Interaction rules", 2)
    bullets(
        doc,
        [
            "Bot messages appear on the left; visitor answers on the right with an accent tint.",
            "A roughly 400 ms typing delay precedes each bot message; prefers-reduced-motion removes the delay.",
            "Enter sends; Shift+Enter inserts a newline. Autofocus is desktop-only to avoid mobile keyboard popups.",
            "The message list is an aria-live region with automatic scrolling to the latest message.",
            "Skipped optional fields render as “—” in the brief.",
            "Start over clears saved progress and restarts from step 1 with the original greeting.",
        ],
    )

    h(doc, "2.4 Review, edit, resume, and strike flow", 2)
    para(
        doc,
        "The review card shows all eight answers with an Edit button beside each field. Edit jumps to that "
        "question without repeating the welcome message, then returns directly to review after the new answer.",
    )
    para(
        doc,
        "Answers and the current step are saved to sessionStorage while the flow is active. Reopening the "
        "page offers “Continue where you left off” or “Start over”. A hydration guard prevents the fresh "
        "default state from overwriting saved progress on mount. No localStorage, cookies, or tracking are used.",
    )
    para(
        doc,
        "Moderation uses three strikes. The first and second abusive answers are refused politely and the same "
        "step is re-asked. The third ends the intake, clears saved progress, and offers a link to the original "
        "Message tab. Nothing is submitted in any strike case.",
    )
    doc.add_picture(str(ROOT / "demo-capture" / "09_review_public.png"), width=Inches(3.2))
    doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    caption(doc, "Review card with per-field Edit actions (live-site capture)")

    # ---- 3 ----
    h(doc, "3. System architecture", 1)
    h(doc, "3.1 Components", 2)
    table(
        doc,
        ["Component", "Location", "Responsibility"],
        [
            ["Intake chat UI", "src/components/contact/IntakeChat.tsx", "Script, chips, inputs, review, resume, strikes, success screen, .md download"],
            ["Contact shell", "ContactPanel.tsx, ContactTrigger.tsx, /contact page", "Mode switch and existing slide-in panel; Message mode unchanged"],
            ["Shared validation module", "shared/intake/*.ts", "Types, chip constants, blocklist, disposable domains, validation, brief compiler"],
            ["Cloudflare Worker", "intake-worker/src/index.ts", "Gatekeeper: server-side verification, moderation, Telegram relay"],
            ["Formspree", "External endpoint", "Permanent email archive of the accepted brief"],
            ["Telegram Bot API", "External endpoint", "Instant summary message plus Markdown brief document"],
        ],
        widths=[1.8, 2.6, 4.7],
    )

    h(doc, "3.2 Data flow", 2)
    code(
        doc,
        "Visitor\n"
        "  -> Intake chat (embedded in ContactPanel)\n"
        "       -> client-side moderation / field validation on every answer\n"
        "       -> POST /verify-email at step 8 (Worker: syntax + disposable + MX)\n"
        "       -> POST /intake on Send (Worker: full re-validation + moderation)\n"
        "            -> if accepted: Telegram sendMessage + sendDocument\n"
        "            -> then: POST Formspree -> owner's email inbox\n"
        "       -> success screen + client-side project-brief-<name>.md download",
    )

    h(doc, "3.3 Gatekeeper ordering", 2)
    para(
        doc,
        "Delivery order is deliberate. The Worker is contacted first. Only a successful Worker response "
        "permits the Formspree archive. This prevents an unverified or abusive brief from reaching any destination.",
    )
    table(
        doc,
        ["Worker result", "Frontend behaviour", "Deliveries"],
        [
            ["2xx accepted", "Proceed to Formspree, then show success screen", "Telegram message + file; Formspree email"],
            ["4xx verification / moderation rejection", "Show reason, return to the offending step, send nothing", "None"],
            ["5xx or network failure (infrastructure)", "Treat as unverified, allow Formspree-only with [Unverified] subject; mailto fallback if Formspree also fails", "Email archive only; brief marked unverified"],
        ],
        widths=[2.2, 4.4, 2.5],
    )
    para(
        doc,
        "Infrastructure failure is not treated as a rejection. That distinction is important: a temporary "
        "Cloudflare or Telegram outage must not silently discard a genuine enquiry.",
    )

    # ---- 4 ----
    h(doc, "4. Validation, moderation, and verification", 1)
    h(doc, "4.1 Two authoritative layers", 2)
    table(
        doc,
        ["Layer", "Purpose", "Can be bypassed?"],
        [
            ["Browser", "Immediate, polite feedback while the visitor types each answer", "Yes — visitor code can be edited"],
            ["Worker", "Authoritative pass at /verify-email and /intake; determines whether anything is delivered", "No — runs on Cloudflare infrastructure"],
        ],
        widths=[1.4, 5.8, 1.9],
    )

    h(doc, "4.2 Moderation", 2)
    bullets(
        doc,
        [
            "A curated shared blocklist covers profanity, explicit terms, slurs, and common leetspeak variants.",
            "Normalisation lowercases input, decodes digits and @/$ to letters, converts punctuation to spaces, collapses repeated letters, and matches whole words or phrases.",
            "Both the blocklist entries and the visitor input pass through the same normaliser. The word “class” is not blocked by “ass”; “fuck!” and “fucck” are blocked.",
            "Three-strike rule ends the session without submission. The list is deterministic and auditable; it is not an AI classifier and cannot catch novel phrasing.",
        ],
    )

    h(doc, "4.3 Anti-gibberish and field rules", 2)
    bullets(
        doc,
        [
            "Rejects answers made of a single repeated word, a couple of identical tokens, or more than 60% repeated characters.",
            "Project details require at least 10 characters and at most 2,000; name 100; design preferences 1,000; extra notes 1,000.",
            "Chip steps (project type, timeline, budget) accept only exact chip values; free-form junk is impossible there.",
            "In the design field, any token starting with “http” must parse as a valid http:// or https:// URL; at most three links are allowed. Bare domains are treated as ordinary text.",
        ],
    )

    h(doc, "4.4 Email verification", 2)
    bullets(
        doc,
        [
            "Syntax check rejects malformed addresses.",
            "A shared disposable-domain list (~50 common domains) blocks throwaway mail such as Mailinator and YOPMail. Privacy relays such as Apple Hide My Email and SimpleLogin are allowed.",
            "The Worker performs a DNS-over-HTTPS MX lookup. A domain with at least one real MX record passes. No MX but an A/AAAA record passes via implicit-MX fallback. An explicit null MX (0 .) is rejected. No MX and no address record is rejected.",
            "The null-MX rule was corrected during testing: DoH presents the record as “0 .”, so the parser strips the preference before comparing the exchange.",
            "Verified means the address is well-formed, permanent, and its domain can receive email. It does not prove the visitor owns that inbox. Inbox-ownership verification (OTP) is a documented v2 option requiring a custom sending domain.",
        ],
    )

    h(doc, "4.5 Honeypot and body limits", 2)
    para(
        doc,
        "A hidden _gotcha field is included in the submission. A non-empty value causes a 422 spam rejection. "
        "The Worker caps the total request body at roughly 20 KB and returns only generic reason codes — never "
        "token fragments, stack traces, or internal details.",
    )

    # ---- 5 ----
    h(doc, "5. Telegram integration", 1)
    h(doc, "5.1 What the bot does", 2)
    para(
        doc,
        "On an accepted intake, the Worker calls the Telegram Bot API twice using the bot token stored as an "
        "encrypted Worker secret. First it sends a short plain-text summary: new project lead, project type, "
        "budget, timeline, name, email, and a short excerpt of the project details. Then it uploads the full "
        "brief as a Markdown document named project-brief-<firstname>.md with a caption containing the visitor's name.",
    )
    para(
        doc,
        "Sending the document as a file avoids Telegram's 4,096-character message limit and keeps the brief "
        "readable and downloadable on every device.",
    )

    h(doc, "5.2 Does the bot also receive messages?", 2)
    para(
        doc,
        "Yes for intake submissions: the bot delivers the accepted brief into your Telegram chat, and the live "
        "test confirmed both the summary message and the .md file arrived.",
    )
    para(
        doc,
        "No for ordinary inbound chat: the bot does not listen to or process messages people send to it. There "
        "is no Telegram webhook configured, so a visitor who messages the bot directly gets no automated reply "
        "and their message does not enter the intake flow. Direct contact still goes through the portfolio's "
        "Message tab or email address.",
    )
    para(
        doc,
        "If inbound handling is wanted later, the extension is a separate Worker route registered as a Telegram "
        "webhook. It could acknowledge messages, link people to /contact, or forward messages into the same "
        "review channel. That work is deliberately outside v1.",
    )

    h(doc, "5.3 Setup and credentials", 2)
    table(
        doc,
        ["Item", "Value / location", "Notes"],
        [
            ["Bot", "@<bot_username>", "Created with @BotFather; profile photo configured"],
            ["Destination chat ID", "Worker secret TELEGRAM_CHAT_ID", "Owner started a chat with the bot during setup"],
            ["Bot token", "Worker secret TELEGRAM_BOT_TOKEN", "Never stored in the site, repository, or logs"],
            ["Worker URL", "https://<worker>.<account>.workers.dev", "Only /verify-email and /intake are exposed"],
        ],
        widths=[1.7, 3.0, 4.4],
    )
    para(
        doc,
        "If the token ever leaks, revoke it with /revoke in @BotFather and replace the Worker secret. No code "
        "change or site redeploy is required.",
    )

    # ---- 6 ----
    h(doc, "6. Security, privacy, and accessibility", 1)
    table(
        doc,
        ["Area", "Implementation"],
        [
            ["Secrets", "Telegram credentials exist only as encrypted Cloudflare Worker secrets. All NEXT_PUBLIC_* values are public by design and contain no credentials."],
            ["CORS", "The Worker allows only the production Pages origin and http://localhost:3000, including OPTIONS preflight."],
            ["Spam", "Client checks, server-side re-validation, honeypot, and Formspree's own filtering. Cloudflare Turnstile is the documented hardening step if spam appears."],
            ["Privacy", "The brief contains only what the visitor typed. It is stored only in the owner's inbox and Telegram. No analytics, cookies, or third-party tracking."],
            ["Accessibility", "Real buttons for chips, visible focus states, keyboard operation, aria-live message log, reduced-motion support, desktop-only autofocus, mobile full-sheet panel."],
            ["Residual risk", "A determined attacker can still POST directly to the public Formspree endpoint, exactly as with the existing contact form. The Worker gatekeeper protects Telegram delivery and the structured brief path."],
        ],
        widths=[1.6, 7.5],
    )

    # ---- 7 ----
    h(doc, "7. Testing and verification", 1)
    h(doc, "7.1 Verification evidence", 2)
    table(
        doc,
        ["Check", "Result"],
        [
            ["Shared-module unit tests", "35 pass — moderation, leetspeak, gibberish, email syntax, disposable domains, field rules, URLs, brief template"],
            ["Worker endpoint cases", "12 pass — verify-email and intake accept/reject paths, CORS, honeypot, chip membership, bad URL, link count, missing name"],
            ["MX decision cases", "8 pass — real MX, null MX, implicit MX via A/AAAA, no address record, NXDOMAIN, DNS failure"],
            ["Browser click-through", "Full 8-step flow, both skips, Edit-and-return, three-strike end, refresh-resume, review, success screen"],
            ["Static checks", "tsc --noEmit clean; targeted eslint clean; clean next build with 18 static pages"],
            ["Build artefacts", "out/ greps confirm intake UI, entry button, worker URL, and untouched hero/marquee markers"],
            ["Live test", "One marked TEST intake submitted on the production domain; success screen and .md download confirmed"],
            ["Delivery confirmation", "Owner confirmed Formspree email in inbox and Telegram message + brief file"],
        ],
        widths=[2.2, 6.9],
    )

    h(doc, "7.2 Defects found and fixed during testing", 2)
    table(
        doc,
        ["Defect", "Fix"],
        [
            ["Null MX presented as “0 .” was treated as a real MX", "Strip numeric preference before checking the exchange; all null MX records reject"],
            ["Leetspeak with trailing punctuation (“FUCK!”) bypassed moderation", "Removed ! and + from the leet map so punctuation becomes a separator"],
            ["Blocklist entries were not normalised, so phrases such as “kill yourself” could miss", "Normalise the blocklist itself with the same function used for input"],
            ["Gibberish check missed two identical tokens and exact 0.4 repeated ratio", "Reject any all-identical answer of two or more tokens and use <= 0.4 threshold"],
            ["Editing step 1 repeated the welcome greeting", "Split intro from question; intro is shown only on fresh start"],
            ["Mount-time persistence overwrote saved progress before resume", "Add hydration guard so writing starts only after the resume decision"],
            ["URL rule let “http//broken-link” pass", "Any token beginning with http must parse as a valid absolute URL"],
        ],
        widths=[4.6, 4.5],
    )

    h(doc, "7.3 Demonstration video", 2)
    para(
        doc,
        "A 30-second H.264 walkthrough was produced from real step captures of the live site, with title and "
        "result cards. It includes the entry flow, all eight questions, the review card, and the success screen.",
    )
    code(doc, r"<project-root>\intake-workflow-demo.mp4")
    para(
        doc,
        "The source frames are in <project-root>\\demo-capture\\. The video is a captures-based walkthrough, "
        "not a continuous real-time screen recording.",
    )
    doc.add_picture(str(ROOT / "demo-capture" / "10_success_public.png"), width=Inches(3.0))
    doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    caption(doc, "Success screen with brief download and support link (live-site capture)")

    # ---- 8 ----
    h(doc, "8. Deployment and operations", 1)
    h(doc, "8.1 Configuration", 2)
    table(
        doc,
        ["Variable", "Where", "Purpose"],
        [
            ["NEXT_PUBLIC_FORMSPREE_ID", "Portfolio .env.local / Pages env", "Email archive endpoint"],
            ["NEXT_PUBLIC_SITE_URL", "Portfolio .env.local / Pages env", "Canonical site URL"],
            ["NEXT_PUBLIC_INTAKE_WORKER_URL", "Portfolio .env.local", "Worker base URL; baked at build time"],
            ["TELEGRAM_BOT_TOKEN", "Worker secret", "Bot API authentication"],
            ["TELEGRAM_CHAT_ID", "Worker secret", "Destination Telegram chat"],
        ],
        widths=[2.4, 2.7, 4.0],
    )

    h(doc, "8.2 Deploy commands", 2)
    code(
        doc,
        "# Worker secrets (one time, or after token rotation)\n"
        "npx wrangler secret put TELEGRAM_BOT_TOKEN -c intake-worker/wrangler.toml\n"
        "npx wrangler secret put TELEGRAM_CHAT_ID -c intake-worker/wrangler.toml\n\n"
        "# Deploy Worker\n"
        "npx wrangler deploy -c intake-worker/wrangler.toml\n\n"
        "# Clean site build and deploy (branch main is production)\n"
        "rm -rf out\n"
        "npx next build\n"
        "npx wrangler pages deploy out --project-name <project-name> --branch main --commit-dirty=true",
    )
    para(
        doc,
        "All NEXT_PUBLIC_* values are compiled into the static export. If the Worker URL changes, update "
        ".env.local, delete out/, rebuild, and redeploy the Pages project. Omitting the --branch flag deploys "
        "to master, which is preview only; always pass --branch main for production.",
    )
    para(
        doc,
        "No git commit or push is part of this workflow. The working tree remains dirty by design; the Pages "
        "CLI is invoked with --commit-dirty=true.",
    )

    # ---- 9 ----
    h(doc, "9. Maintenance and future options", 1)
    h(doc, "9.1 Where to make common changes", 2)
    table(
        doc,
        ["Change", "File"],
        [
            ["Chip options", "shared/intake/constants.ts"],
            ["Blocked words / phrases", "shared/intake/blocklist.ts"],
            ["Disposable email domains", "shared/intake/disposable.ts"],
            ["Field length caps", "shared/intake/constants.ts"],
            ["Question wording or messages", "src/components/contact/IntakeChat.tsx"],
            ["Brief layout", "shared/intake/brief.ts"],
            ["Worker validation or Telegram calls", "intake-worker/src/index.ts"],
            ["Colours and radius tokens", "DESIGN.md and src/app/globals.css"],
        ],
        widths=[3.6, 5.5],
    )

    h(doc, "9.2 Documented v2 options", 2)
    table(
        doc,
        ["Option", "Trigger", "Change"],
        [
            ["Email ownership (OTP)", "A custom sending domain is available", "Worker sends a six-digit code between steps 8 and 9"],
            ["Turnstile", "Telegram spam appears", "Add widget and server-side verification in the Worker"],
            ["n8n workflow / lead database", "High volume or need for a searchable lead store", "Swap or add submit endpoint; chat code unchanged"],
            ["Client auto-reply email", "Instant acknowledgement is wanted", "Requires a sending service through the Worker"],
            ["Bilingual EN/MY flow", "Myanmar client volume justifies it", "Duplicate the script behind a language chip"],
            ["Inbound Telegram messages", "Visitors should be able to message the bot", "Add a Telegram webhook Worker route; not part of v1"],
        ],
        widths=[2.1, 3.0, 4.0],
    )

    h(doc, "Appendix A — Compiled brief template", 1)
    code(
        doc,
        "# Project Brief — <name>\n"
        "Date: <YYYY-MM-DD> · Source: Portfolio intake chat\n"
        "Email verified: domain MX confirmed · not a disposable address\n\n"
        "## Contact\n"
        "- Name: <name>\n"
        "- Email: <email>\n\n"
        "## Project\n"
        "- Type: <project_type>\n"
        "- Details: <project_details>\n"
        "- Design preferences / references: <design_preferences or —>\n\n"
        "## Logistics\n"
        "- Timeline: <timeline>\n"
        "- Budget: <budget>\n"
        "- Anything else: <extra_notes or —>",
    )
    para(
        doc,
        "The same template is used for the Formspree brief field, the Telegram document, the visitor's .md "
        "download, and the mailto fallback body. When verification infrastructure is unavailable, the "
        "verification line reads “skipped — verification service unreachable”.",
    )

    h(doc, "Appendix B — Glossary", 1)
    table(
        doc,
        ["Term", "Meaning"],
        [
            ["Gatekeeper", "The Worker step that must accept a submission before any delivery is allowed"],
            ["MX record", "DNS record that tells the internet which servers handle email for a domain"],
            ["Null MX", "An MX record of preference 0 and exchange ‘.’, declaring that a domain accepts no mail"],
            ["Disposable email", "A temporary address created to receive mail once and then discarded"],
            ["Leetspeak", "Substitution of digits or symbols for letters, such as s3x or fucck"],
            ["Honeypot", "A hidden form field that humans leave empty and naive bots fill in"],
            ["Static export", "A Next.js build that produces plain HTML/CSS/JS with no server runtime"],
            ["sessionStorage", "Browser storage scoped to one tab and session; cleared when the tab closes"],
        ],
        widths=[1.9, 7.2],
    )

    doc.save(OUT)
    print(f"saved {OUT}")


if __name__ == "__main__":
    build()
