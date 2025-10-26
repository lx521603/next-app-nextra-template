'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
// 导入 Location 组件
import Location from '@/components/Location';

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
  components?: any;
}

// 定义全局组件映射
const globalComponents = {
  Location: Location,
  // 可以在这里添加其他全局组件
};

/**
 * 这是一个客户端组件，用于渲染 MDXRemote。
 * 它修复了在 Server Component 中直接使用 MDXRemote 导致的 Invalid hook call 错误。
 */
export default function MDXRenderer({ source, components }: MDXRendererProps) {
  // 合并全局组件和传入的组件
  const mergedComponents = {
    ...globalComponents,
    ...components,
  };

  return (
    <MDXRemote 
      {...source} 
      components={mergedComponents} 
    />
  );
}