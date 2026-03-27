import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: Props) {
  const allItems: BreadcrumbItem[] = [{ label: "ホーム", href: "/" }, ...items];

  // 構造化データ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href
        ? `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://uvlabo.com"}${item.href}`
        : undefined,
    })),
  };

  return (
    <>
      <nav aria-label="パンくずリスト">
        <ol className="flex items-center gap-1 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap pb-0.5">
          {allItems.map((item, i) => {
            const isLast = i === allItems.length - 1;
            return (
              <li key={i} className="flex items-center gap-1 shrink-0">
                {i === 0 && <Home className="w-3 h-3 shrink-0" />}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast
                        ? "text-foreground font-medium truncate max-w-[180px]"
                        : ""
                    }
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight className="w-3 h-3 shrink-0 text-muted-foreground/50" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
