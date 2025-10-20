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
  // 新增 gallery 字段，支持字符串数组或单个字符串
  gallery?: string[] | string | unknown; // 允许 unknown 以应对 matter 解析的任何类型
  
  // 保持旧的单图字段作为回退
  cover?: string | unknown;      
  img?: string | unknown;        
  image?: string | unknown;       
  coverImage?: string | unknown; 
  
  show?: boolean;         
  showInCarousel?: boolean; 
  [key: string]: any; 
}

// --- 辅助函数 ---

/**
 * 核心修改：根据 Frontmatter 提取所有用于照片墙的图片 URL 列表。
 * 优先级: gallery (数组) > gallery (单张) > 其它单图字段
 * * NOTE: 增加防御性检查，确保只处理有效的字符串值。
 */
function getGalleryUrls(frontmatter: PostFrontmatter): string[] {
    const urls: string[] = [];

    // 1. 优先检查 gallery 字段
    if (frontmatter.gallery) {
        if (Array.isArray(frontmatter.gallery)) {
            // 如果是数组，过滤掉所有非字符串或空字符串的项
            const validUrls = frontmatter.gallery.filter(url => typeof url === 'string' && url.trim().length > 0);
            if (validUrls.length > 0) return validUrls;
        } else if (typeof frontmatter.gallery === 'string' && frontmatter.gallery.trim().length > 0) {
            // 如果是单个字符串
            return [frontmatter.gallery];
        }
    }
    
    // 2. 如果 gallery 不存在或无效，回退到旧的单图字段
    // 优先级: cover > img > image > coverImage
    
    // 辅助检查函数，确保字段是有效的非空字符串
    const getValidUrl = (field: unknown): string | null => 
        (typeof field === 'string' && field.trim().length > 0) ? field : null;

    const singleUrl = 
        getValidUrl(frontmatter.cover) ||
        getValidUrl(frontmatter.img) ||
        getValidUrl(frontmatter.image) ||
        getValidUrl(frontmatter.coverImage);
        
    if (singleUrl) {
        return [singleUrl];
    }

    return [];
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

    try {
        // 尝试获取目录下的文件列表
        const files = await fs.readdir(dir);

        // 核心防御性编程: 确保 files 确实是一个数组，防止 Netlify 运行时环境中 fs 库的异常返回导致 for...of 报错
        if (!Array.isArray(files)) {
             console.error(`❌ [API/Carousel] fs.readdir 返回值不是数组: ${dir}`);
             return [];
        }

        for (const file of files) {
            const fullPath = path.join(dir, file);
            let stat;
            try {
                stat = await fs.stat(fullPath);
            } catch (e) {
                // 如果 stat 失败（例如文件权限问题），跳过此文件/目录
                continue;
            }

            // 计算相对于 ROOT_DIRECTORY 的相对路径
            const relativePath = path.relative(ROOT_DIRECTORY, fullPath);

            if (stat.isDirectory()) {
                // 递归调用
                const subResults = await crawlDirectory(fullPath);
                // 再次防御性检查：确保 subResults 是数组，防止 sub-call 异常影响当前 call
                if (Array.isArray(subResults)) {
                    results = results.concat(subResults);
                }
            } else if (stat.isFile() && (file.endsWith('.mdx') || file.endsWith('.md'))) {
                
                let fileContent;
                try {
                    fileContent = await fs.readFile(fullPath, 'utf8');
                } catch (e) {
                    console.error(`❌ 无法读取文件内容: ${fullPath}`, e);
                    continue; // 跳过无法读取的文件
                }

                const { data } = matter(fileContent);
                const frontmatter = data as PostFrontmatter;

                if (shouldShowInCarousel(frontmatter)) {
                    
                    const imageUrls = getGalleryUrls(frontmatter);

                    if (imageUrls.length > 0) {
                        let slug = relativePath.replace(/\.(mdx|md)$/, '');
                        // 如果是 index.mdx/md，链接应该指向父目录 (例如 /docs/api/index.mdx -> /docs/api)
                        // 注意：Nextra通常会处理掉 /index 部分，但为了安全，这里保持您的原始逻辑
                        
                        const link = `/carousel/${slug}`; 

                        // 遍历所有图片，为每张图片创建一个独立的 CarouselImage 对象
                        const newImages = imageUrls.map((url, index) => ({
                            url: url,
                            title: frontmatter.title, 
                            link: link, 
                            alt: `${frontmatter.title} (图 ${index + 1})`, 
                        }));
                        
                        results = results.concat(newImages);

                    } else {
                        console.warn(`⚠️ 文章 "${frontmatter.title}" (${relativePath}) 标记了轮播，但缺少图片 URL。`);
                    }
                }
            }
        }
    } catch (e) {
        // 捕获顶层文件遍历中的具体错误 (如 ROOT_DIRECTORY 不存在)
        console.error(`❌ 文件系统操作失败或目录不可读: ${dir}`, e);
        // 如果出错，确保返回空数组，而不是 undefined 或 null
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
    
    // 确保返回的数据是可序列化的数组
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
