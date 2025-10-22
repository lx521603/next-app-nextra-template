declare module 'next-mdx-remote' {
  export interface MDXRemoteSerializeResult {
    compiledSource: string;
    renderedOutput?: string;
    scope?: any;
    frontmatter?: any;
  }

  export interface MDXRemoteProps {
    compiledSource: string;
    components?: any;
    scope?: any;
    frontmatter?: any;
  }

  export const MDXRemote: React.ComponentType<MDXRemoteProps>;
}
