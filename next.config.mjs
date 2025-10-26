// next.config.js（优化版）
import bundleAnalyzer from '@next/bundle-analyzer';
import nextra from 'nextra';
import { withMDX } from 'next-mdx-rs';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextra = nextra({
  latex: true,
  search: { codeblocks: false },
  contentDirBasePath: '/docs',
});

export default withNextra(
  withMDX()(
    withBundleAnalyzer({
      output: 'export',
      images: { unoptimized: true },
      cleanDistDir: true,
      eslint: { ignoreDuringBuilds: true },
      experimental: {
        ppr: true,
        optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
      },
    })
  )
);