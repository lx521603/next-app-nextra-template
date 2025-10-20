import * as fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse, type NextRequest } from 'next/server';

// --- 接口定义 ---
// 注意：CarouselImage 现在代表的是单个轮播项
interface CarouselImage {
  url: string;
  alt: string;
  title: string;
  link: string;
}

interface PostFrontmatter {
  title: string;
  // 新增 gallery 字段，支持字符串数组或单个字符串（Nextra/Markdown 格式可能解析为两者之一）
  gallery?: string[] | string;
  
  // 保持旧的单图字段作为回退
  cover?: string;      
  img?: string;        
  image?: string;       
  coverImage?: string; 
  
  show?: boolean;         
  showInCarousel?: boolean; 
  [key: string]: any; 
}

// --- 辅助函数 ---

/**
 * 核心修改：根据 Frontmatter 提取所有用于照片墙的图片 URL 列表。
 * 优先级: gallery (数组) > gallery (单张) > img/image/cover (单张)
 * @param frontmatter 文章的 Frontmatter 数据
 * @returns 包含所有轮播图片 URL 的数组
 */
function getGalleryUrls(frontmatter: PostFrontmatter): string[] {
    const urls: string[] = [];

    // 1. 优先检查 gallery 字段
    if (frontmatter.gallery) {
        if (Array.isArray(frontmatter.gallery)) {
            // 如果是数组，直接返回所有有效 URL
            return frontmatter.gallery.filter(url => typeof url === 'string' && url.length > 0);
        } else if (typeof frontmatter.gallery === 'string') {
            // 如果是单个字符串，作为单个图片返回
            urls.push(frontmatter.gallery);
            return urls;
        }
    }
    
    // 2. 如果 gallery 不存在或无效，回退到旧的单图字段
    // 优先级: cover > img > image > coverImage
    if (frontmatter.cover && typeof frontmatter.cover === 'string') {
        urls.push(frontmatter.cover);
    } else if (frontmatter.img && typeof frontmatter.img === 'string') {
        urls.push(frontmatter.img);
    } else if (frontmatter.image && typeof frontmatter.image === 'string') {
        urls.push(frontmatter.image);
    } else if (frontmatter.coverImage && typeof frontmatter.coverImage === 'string') {
        urls.push(frontmatter.coverImage);
    }

    // 此时 urls 数组最多包含一个元素
    return urls;
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
                    
                    // 核心修改：获取所有图片 URL
                    const imageUrls = getGalleryUrls(frontmatter);

                    if (imageUrls.length > 0) {
                        // 移除文件后缀 (.mdx/.md)
                        let slug = relativePath.replace(/\.(mdx|md)$/, '');
                        
                        // 统一链接前缀
                        const link = `/carousel/${slug}`; 

                        // 遍历所有图片，为每张图片创建一个独立的 CarouselImage 对象
                        const newImages = imageUrls.map((url, index) => ({
                            url: url,
                            // 标题和链接指向文章本身
                            title: frontmatter.title, 
                            link: link, 
                            // alt 文本可以包含图片序号
                            alt: `${frontmatter.title} (图 ${index + 1})`, 
                        }));
                        
                        // 将这个文章的所有图片添加到总结果中
                        results = results.concat(newImages);

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
    // crawlDirectory 现在返回一个扁平化的图片列表
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
