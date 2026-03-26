import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "wrap" }],
    ],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
}

export default withMDX(nextConfig)