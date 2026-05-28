import { AUTHOR } from "@/lib/constants";
import { PhysicalPreOrderCTA } from "@/components/commerce/PhysicalPreOrderCTA";
import { LandingIcon } from "@/components/ui/LandingIcon";

interface ReadOnlineLinksProps {
  className?: string;
  location?: string;
}

export function ReadOnlineLinks({
  className = "",
  location = "read-online",
}: ReadOnlineLinksProps) {
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
              <LandingIcon name="arrow-top-right-on-square" className="h-4 w-4" />
            </span>
          </a>
        ))}
      </div>

      <PhysicalPreOrderCTA location={location} />
    </div>
  );
}
