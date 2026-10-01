type Props = {
  url: string;
  title: string;
};

export function LiveDemo({ url, title }: Props) {
  let host = url;
  try {
    host = new URL(url).host;
  } catch {
    // keep raw url if invalid
  }

  return (
    <section className="mt-16 max-w-5xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xs uppercase tracking-widest text-white/40">
          Live demo
        </h2>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          Open in new tab
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          </span>
          <span className="flex-1 truncate rounded-xl bg-white/5 px-3 py-1 text-xs text-white/50">
            {host}
          </span>
        </div>

        <iframe
          src={url}
          title={`${title} live demo`}
          loading="lazy"
          className="h-[58vh] max-h-[720px] min-h-[420px] w-full bg-white sm:aspect-[16/10] sm:h-auto sm:max-h-none"
        />
      </div>

      <p className="mt-3 text-xs text-white/40">
        If the preview appears blank, the site may block embedding — use
        &quot;Open in new tab&quot; above.
      </p>
    </section>
  );
}
