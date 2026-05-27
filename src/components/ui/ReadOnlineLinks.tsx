import { AUTHOR } from "@/lib/constants";

interface ReadOnlineLinksProps {
  className?: string;
}

export function ReadOnlineLinks({ className = "" }: ReadOnlineLinksProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium uppercase tracking-widest text-emerald-400 mb-4">
        Read Online
      </h3>
      <div className="space-y-3">
        {AUTHOR.books.map((book) => (
          <a
            key={book.readOnlinePath}
            href={book.readOnlinePath}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 glass-card glass-card-hover rounded-xl px-5 py-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-foreground group-hover:text-emerald-400 transition-colors leading-snug">
                {book.title}
              </p>
              <p className="text-xs text-muted mt-1">
                Preview: TOC, foreword, preface & introduction
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              Read Online
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
