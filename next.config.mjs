import bundleAnalyzer from '@next/bundle-analyzer';
import nextra from 'nextra';
import withMDX from '@next/mdx';  // ← 官方 MDX，替换 next-mdx-rs

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextra = nextra({
  latex: true,
  search: { codeblocks: false },
  contentDirBasePath: '/docs',
});

export default withNextra(
  withMDX({  // ← 用官方 withMDX
    extension: /\.(md|mdx)$/,
    options: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  })(
    withBundleAnalyzer({
      output: 'export',                    // 纯静态
      images: { unoptimized: true },
      cleanDistDir: true,
      eslint: { ignoreDuringBuilds: true },
      reactStrictMode: false,
      experimental: {
        ppr: true,                         // 部分预渲染
        optimizePackageImports: [
          '@mantine/core',
          '@mantine/hooks',
          '@gfazioli/mantine-clock',
          '@gfazioli/mantine-marquee',
          '@gfazioli/mantine-text-animate',
        ],
      },
    })
  )
);