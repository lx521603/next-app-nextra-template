'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

interface MDXRendererProps {
  // source 是由服务器端 serialize 产生的编译结果
  source: MDXRemoteSerializeResult;
  // 可以传递自定义组件
  components?: any;
}

/**
 * 这是一个客户端组件，用于渲染 MDXRemote。
 * 它修复了在 Server Component 中直接使用 MDXRemote 导致的 Invalid hook call 错误。
 */
export default function MDXRenderer({ source, components }: MDXRendererProps) {
  return (
    <MDXRemote 
      {...source} 
      components={components} 
    />
  );
}
