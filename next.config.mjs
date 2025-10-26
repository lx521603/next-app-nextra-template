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
    output: 'export',                    // 纯静态导出
    images: { unoptimized: true },       // 静态必需
    cleanDistDir: true,
    eslint: { ignoreDuringBuilds: true },
    reactStrictMode: false,

    // Next.js 16 新的配置方式
    cacheComponents: true,               // 替代 experimental.ppr，启用组件缓存和部分预渲染
    
    experimental: {
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