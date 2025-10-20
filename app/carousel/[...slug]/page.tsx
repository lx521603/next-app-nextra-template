// app/carousel/[...slug]/page.tsx

import { redirect } from 'next/navigation';

interface PostPageProps {
  params: {
    slug: string[];
  };
}

/**
 * 这个页面现在只负责将流量重定向到正确的 /docs 路径。
 */
export default function PostPage({ params }: PostPageProps) {
  const originalPathSegments = params.slug; 
  
  // 原始路径示例：['shot', 'bs', 'bsqlj']
  // 拼接成 /shot/bs/bsqlj
  const pathSuffix = originalPathSegments.join('/');
  
  // 目标 URL：/docs/shot/bs/bsqlj
  const targetUrl = `/docs/${pathSuffix}`;
  
  console.log(`正在从 /carousel/${pathSuffix} 重定向到 ${targetUrl}`);

  // 使用 Next.js 的 redirect 函数进行永久重定向 (308 状态码)
  // 如果是 Nextra 文档，通常会希望保留永久性，所以使用 308
  redirect(targetUrl); 

  // 由于 redirect 会抛出异常，所以下面的代码实际上不会执行，但为了函数完整性保留
  return null;
}

// 暂时返回空数组
export async function generateStaticParams() {
  return [];
}