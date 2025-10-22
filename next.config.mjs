import bundleAnalyzer from '@next/bundle-analyzer';
import nextra from 'nextra';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  contentDirBasePath: '/docs',
})

export default withNextra(
  withBundleAnalyzer({
    reactStrictMode: false,
    cleanDistDir: true,
    // 移除 eslint 配置，因为它不再在 next.config.mjs 中支持
    experimental: {
      optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
  }));