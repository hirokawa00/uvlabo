"use client";

import { useEffect, useState } from "react";
import { TableOfContents, type TocItem } from "./TableOfContents";

type Props = {
  articleId: string; // <article>要素のid属性
};

/**
 * 記事がDOMに描画された後にh2/h3を走査して目次を自動生成する。
 * rehype-slugがid属性を付与している前提。
 */
export function AutoTableOfContents({ articleId }: Props) {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const article = document.getElementById(articleId);
    if (!article) return;

    const headings = article.querySelectorAll("h2[id]");
    const toc: TocItem[] = Array.from(headings).map((el) => ({
      id: el.id,
      text: el.textContent?.replace(/^#/, "").trim() ?? "",
      level: (el.tagName === "H2" ? 2 : 3) as 2 | 3,
    }));

    setItems(toc);
  }, [articleId]);

  return <TableOfContents items={items} />;
}
