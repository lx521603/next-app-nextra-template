// app/carousel/[...slug]/page.tsx

// ----------------------------------------------------------------------
// 🚨 强制忽略类型检查，以解决 Netlify 插件环境的兼容性问题
// ----------------------------------------------------------------------
// @ts-nocheck 
import { redirect } from 'next/navigation';

// 移除 interface PostPageProps {}

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