import * as fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
// 导入我们创建的客户端渲染器
import MDXRenderer from '@/components/MDX/MDXRenderer'; 

// ----------------------------------------------------
// 辅助常量 - 在 Node.js 环境中执行
// ----------------------------------------------------
// ⚠️ 确保您的 MDX 内容文件位于项目根目录下的 'content' 文件夹
const CONTENT_DIR = path.join(process.cwd(), 'content'); 

interface PostPageProps {
  params: {
    slug: string[]; // 捕获的路径段，例如 ['AvoidPitfalls', '444']
  };
}

/**
 * 核心逻辑：根据路径段读取文件，并编译 MDX
 * 这是一个服务器端函数
 */
async function getPostData({ slug }: { slug: string[] }) {
  
  // 将 ['AvoidPitfalls', '444'] 转换为 'AvoidPitfalls/444'
  const slugPath = slug.join(path.sep); 
  
  const filePathMdx = path.join(CONTENT_DIR, `${slugPath}.mdx`);
  const filePathMd = path.join(CONTENT_DIR, `${slugPath}.md`);

  // 终端调试日志，帮助确认路径
  console.log(`[DEBUG_MDX] 尝试加载 URL: /carousel/${slug.join('/')}`);
  console.log(`[DEBUG_MDX] 预期文件路径 (.mdx): ${filePathMdx}`);
  
  let fileContent: string;

  try {
    // 优先尝试 .mdx
    fileContent = await fs.readFile(filePathMdx, 'utf8');
    console.log(`[DEBUG_MDX] ✅ 文件找到: ${filePathMdx}`);
  } catch (e) {
    try {
      // 其次尝试 .md
      fileContent = await fs.readFile(filePathMd, 'utf8');
      console.log(`[DEBUG_MDX] ✅ 文件找到: ${filePathMd}`);
    } catch (error) {
      // 两种后缀都找不到，返回 null 触发 404
      console.error(`[ERROR_MDX] 找不到文件: ${filePathMdx} 或 ${filePathMd}`);
      return null;
    }
  }

  try {
      // 使用 next-mdx-remote 编译 MDX 内容 (Server Side)
      const mdxSource = await serialize(fileContent, { parseFrontmatter: true });
      return { source: mdxSource };
  } catch (compileError) {
      console.error(`[ERROR_MDX] MDX 编译失败，可能是格式错误:`, compileError);
      return null;
  }
}


// ----------------------------------------------------
// 页面组件 (Server Component)
// ----------------------------------------------------

export default async function PostPage({ params }: PostPageProps) {
  const postData = await getPostData(params);

  if (!postData) {
    notFound(); // 文件找不到或编译失败，触发 404
  }

  const { source } = postData;
  const title = source.frontmatter.title as string || '文章标题';

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1>{title}</h1>
      <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px', lineHeight: 1.6 }}>
        {/* 使用 Client Component (MDXRenderer) 来包装 MDXRemote */}
        <MDXRenderer 
          source={source} 
          components={{ 
            // 在这里传递文章中使用的自定义组件
          }} 
        />
      </div>
    </div>
  );
}


// ----------------------------------------------------
// 静态路径生成 (SSG/ISR)
// ----------------------------------------------------

export async function generateStaticParams() {
  const allSlugs: { slug: string[] }[] = [];

  async function recursiveFindSlugs(currentDir: string, relativePath: string = '') {
    const items = await fs.readdir(currentDir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);
      const itemRelativePath = path.join(relativePath, item.name);

      if (item.isDirectory()) {
        await recursiveFindSlugs(fullPath, itemRelativePath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        
        const slugSegments = itemRelativePath
                              .replace(/\.(mdx|md)$/, '')
                              .split(path.sep);

        allSlugs.push({ slug: slugSegments });
      }
    }
  }

  try {
    await recursiveFindSlugs(CONTENT_DIR);
  } catch (e) {
    // 目录不存在时返回空
    return []; 
  }

  return allSlugs;
}
