import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/30 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between w-full">
          <span className="font-serif text-lg font-semibold text-foreground">
            哲学圆桌会
          </span>
          <span className="text-sm text-muted-foreground">
            Design by xxy | 18968150525
          </span>
        </div>
        <Link
          href="/app"
          className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          点击体验
        </Link>
      </div>
    </footer>
  );
}
