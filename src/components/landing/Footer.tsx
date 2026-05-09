import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/30 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <span className="font-serif text-lg font-semibold text-foreground">
            哲学圆桌会
          </span>
          <Link
            href="/app"
            className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            点击体验
          </Link>
        </div>

        <div className="w-full rounded-2xl border border-white/20 bg-white/5 p-6">
          <p className="mb-4 text-center text-sm font-semibold text-foreground">
            联系开发者
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span>18968150525</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                微信同号
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <span>1417541455@qq.com</span>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground/70">
            目前处于测试阶段，欢迎反馈和建议
          </p>
        </div>
      </div>
    </footer>
  );
}
