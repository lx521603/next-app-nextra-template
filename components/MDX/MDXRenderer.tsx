'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
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