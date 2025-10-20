// app/carousel/[...slug]/page.tsx

import { redirect } from 'next/navigation';

// 移除 interface PostPageProps {}

/**
 * 这个页面现在只执行服务器端重定向。
 * 直接在函数签名中定义 params 的类型，避免 TypeScript 冲突。
 */
// 页面组件函数签名现在是 { params: { slug: string[] } }
export default function PostPage({ params }: { params: { slug: string[] } }) {
  const originalPathSegments = params.slug; 
  
  // 拼接路径，例如：shot/bs/bsqlj
  const pathSuffix = originalPathSegments.join('/');
  
  // 目标 URL：/docs/shot/bs/bsqlj
  const targetUrl = `/docs/${pathSuffix}`;
  
  console.log(`正在从 /carousel/${pathSuffix} 重定向到 ${targetUrl}`);

  // 使用 Next.js 的 redirect 函数执行重定向
  redirect(targetUrl); 

  return null; 
}

// 暂时返回空数组
export async function generateStaticParams() {
  return [];
}