import bundleAnalyzer from '@next/bundle-analyzer';
import nextra from 'nextra';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextra = nextra({
  latex: true,
  search: { codeblocks: false },
  contentDirBasePath: '/docs',
});

export default withNextra(
  withBundleAnalyzer({
    output: 'export',
    images: { unoptimized: true },
    cleanDistDir: true,
    eslint: { ignoreDuringBuilds: true },
    reactStrictMode: false,
    experimental: {
      ppr: true,
      optimizePackageImports: [
        '@mantine/core',
        '@mantine/hooks',
        '@gfazioli/mantine-clock',
        '@gfazioli/mantine-marquee',
        '@gfazioli/mantine-text-animate',
      ],
    },
  })
);