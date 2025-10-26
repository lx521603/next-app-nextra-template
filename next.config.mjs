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
  // 移除 mdxOptions，Nextra 不支持
})

export default withNextra(
  withBundleAnalyzer({
    reactStrictMode: false,
    cleanDistDir: true,
    experimental: {
      optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
  }));