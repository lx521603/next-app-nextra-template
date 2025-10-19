import * as fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse, type NextRequest } from 'next/server';

// --- 接口定义 ---
interface CarouselImage {
  url: string;
  alt: string;
  title: string;
  link: string;
}

interface PostFrontmatter {
  title: string;
  cover?: string;      
  img?: string;        
  image?: string;       
  coverImage?: string; 
  show?: boolean;         
  showInCarousel?: boolean; 
  [key: string]: any; 
}

// --- 辅助函数 ---
function getImageUrl(frontmatter: PostFrontmatter): string | null {
    // 优先级: cover > img > image > coverImage
    if (frontmatter.cover && typeof frontmatter.cover === 'string') return frontmatter.cover;
    if (frontmatter.img && typeof frontmatter.img === 'string') return frontmatter.img;
    if (frontmatter.image && typeof frontmatter.image === 'string') return frontmatter.image;
    if (frontmatter.coverImage && typeof frontmatter.coverImage === 'string') return frontmatter.coverImage;
    return null;
}

function shouldShowInCarousel(frontmatter: PostFrontmatter): boolean {
    // 优先级: show > showInCarousel
    if (frontmatter.show === true) return true;
    if (frontmatter.showInCarousel === true) return true;
    return false;
}

// 根目录指向 'content'
const ROOT_DIRECTORY = path.join(process.cwd(), 'content'); 


// --- 核心递归抓取函数 ---
async function crawlDirectory(dir: string): Promise<CarouselImage[]> {
    let results: CarouselImage[] = [];

    // 检查目录是否存在且可读
    try {
        await fs.access(dir);
    } catch (e) {
        console.warn(`[API WARNING] MDX 目录不存在或不可访问: ${dir}`);
        return [];
    }

    try {
        const files = await fs.readdir(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = await fs.stat(fullPath);

            // 计算相对于 ROOT_DIRECTORY 的相对路径
            const relativePath = path.relative(ROOT_DIRECTORY, fullPath);

            if (stat.isDirectory()) {
                // 递归调用
                const subResults = await crawlDirectory(fullPath);
                results = results.concat(subResults);
            } else if (stat.isFile() && (file.endsWith('.mdx') || file.endsWith('.md'))) {
                
                const fileContent = await fs.readFile(fullPath, 'utf8');
                const { data } = matter(fileContent);
                const frontmatter = data as PostFrontmatter;

                if (shouldShowInCarousel(frontmatter)) {
                    const imageUrl = getImageUrl(frontmatter);

                    if (imageUrl) {
                        // 移除文件后缀 (.mdx/.md)
                        let slug = relativePath.replace(/\.(mdx|md)$/, '');
                        
                        // ❌ 以前这里有移除数字的逻辑，现在确保它被删除，保留完整路径
                        // slug = slug.replace(/\/\d+$/, ''); 
                        
                        // ✅ 修复：加上 /carousel 前缀。例如：/carousel/AvoidPitfalls/444
                        const link = `/carousel/${slug}`; 
                        
                        results.push({
                            url: imageUrl,
                            alt: frontmatter.title, 
                            title: frontmatter.title,
                            link: link, // 正确的链接
                        });
                    } else {
                        console.warn(`⚠️ 文章 "${frontmatter.title}" (${relativePath}) 标记了轮播，但缺少图片 URL。`);
                    }
                }
            }
        }
    } catch (e) {
        // 捕获文件遍历中的具体错误，确保进程不崩溃
        console.error(`❌ 文件系统操作失败或目录不可读: ${dir}`, e);
    }

    return results;
}

/**
 * Next.js App Router GET 请求处理函数
 */
export async function GET() {
  try {
    const carouselData = await crawlDirectory(ROOT_DIRECTORY);
    
    console.log(`✅ [API/Carousel] 成功抓取 ${carouselData.length} 条轮播数据.`);
    return NextResponse.json(carouselData);

  } catch (error) {
    console.error(`❌ [API/Carousel] 顶层请求处理失败:`, error);
    
    // 返回一个标准的 500 JSON 响应
    return new NextResponse(JSON.stringify({ error: 'Failed to load carousel data on server' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export const dynamic = 'force-dynamic';
