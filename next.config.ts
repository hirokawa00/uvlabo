import type { NextConfig } from "next"
import createMDX from "@next/mdx"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"

// rehype-autolink-headings は Turbopack と非互換のため除外
// 見出しへのリンクは CSS hover で代替する
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
}

export default withMDX(nextConfig)