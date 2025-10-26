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
  // 添加 MDX 组件映射
  mdxOptions: {
    providerImportSource: '@mdx-js/react',
  },
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