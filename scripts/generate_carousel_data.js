// 这是一个独立的 Node.js 脚本，用于在 Next.js 构建时生成轮播数据。
// 它将爬取文件系统的工作从运行时 (Runtime) 转移到构建时 (Build Time)，
// 彻底解决 FUNCTION_INVOCATION_TIMEOUT 错误。

const fs = require('fs/promises');
const path = require('path');
const matter = require('gray-matter');

// --- 接口定义（JavaScript版本） ---
// 定义数据结构，与 TypeScript 保持一致
// eslint-disable-next-line @typescript-eslint/naming-convention
/**
 * @typedef {Object} CarouselImage
 * @property {string} url
 * @property {string} alt
 * @property {string} title
 * @property {string} link
 */

/**
 * @typedef {Object} PostFrontmatter
 * @property {string} title
 * @property {string[] | string | unknown} [gallery]
 * @property {string | unknown} [cover]
 * @property {string | unknown} [img]
 * @property {string | unknown} [image]
 * @property {string | unknown} [coverImage]
 * @property {boolean} [show]
 * @property {boolean} [showInCarousel]
 */

// --- 配置 ---
// 根目录指向 'content'
const ROOT_DIRECTORY = path.join(process.cwd(), 'content'); 
// 静态数据输出路径
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'carousel_data.json'); 

// --- 辅助函数 ---

/**
 * 根据 Frontmatter 提取所有用于照片墙的图片 URL 列表。
 * @param {PostFrontmatter} frontmatter
 * @returns {string[]}
 */
function getGalleryUrls(frontmatter) {
    // ... [保持您原有的 getGalleryUrls 逻辑]
    const urls = [];

    // 1. 优先检查 gallery 字段
    if (frontmatter.gallery) {
        if (Array.isArray(frontmatter.gallery)) {
            const validUrls = frontmatter.gallery.filter(url => typeof url === 'string' && url.trim().length > 0);
            if (validUrls.length > 0) return validUrls;
        } else if (typeof frontmatter.gallery === 'string' && frontmatter.gallery.trim().length > 0) {
            return [frontmatter.gallery];
        }
    }
    
    // 2. 如果 gallery 不存在或无效，回退到旧的单图字段
    const getValidUrl = (field) => 
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


/**
 * 检查 Frontmatter 是否允许显示在轮播中。
 * @param {PostFrontmatter} frontmatter
 * @returns {boolean}
 */
function shouldShowInCarousel(frontmatter) {
    if (frontmatter.show === true) return true;
    if (frontmatter.showInCarousel === true) return true;
    return false;
}


// --- 核心递归抓取函数 ---

/**
 * 递归爬取目录并收集轮播数据。
 * @param {string} dir
 * @returns {Promise<CarouselImage[]>}
 */
async function crawlDirectory(dir) {
    /** @type {CarouselImage[]} */
    let results = [];

    try {
        const files = await fs.readdir(dir);

        if (!Array.isArray(files)) {
             console.error(`❌ [Generate Script] fs.readdir returned non-array: ${dir}`);
             return [];
        }

        for (const file of files) {
            const fullPath = path.join(dir, file);
            let stat;
            try {
                stat = await fs.stat(fullPath);
            } catch (e) {
                continue;
            }

            const relativePath = path.relative(ROOT_DIRECTORY, fullPath);

            if (stat.isDirectory()) {
                const subResults = await crawlDirectory(fullPath);
                if (Array.isArray(subResults)) {
                    results = results.concat(subResults);
                }
            } else if (stat.isFile() && (file.endsWith('.mdx') || file.endsWith('.md'))) {
                
                let fileContent;
                try {
                    fileContent = await fs.readFile(fullPath, 'utf8');
                } catch (e) {
                    console.error(`❌ [Generate Script] Failed to read file content: ${fullPath}`, e);
                    continue;
                }

                const { data } = matter(fileContent);
                /** @type {PostFrontmatter} */
                const frontmatter = data;

                if (shouldShowInCarousel(frontmatter)) {
                    
                    const imageUrls = getGalleryUrls(frontmatter);

                    if (imageUrls.length > 0) {
                        const slug = relativePath.replace(/\.(mdx|md)$/, '');
                        // 注意：Nextra通常会处理掉 /index 部分，这里保留您的原始链接逻辑
                        const link = `/carousel/${slug}`; 

                        // 遍历所有图片，为每张图片创建一个独立的 CarouselImage 对象
                        const newImages = imageUrls.map((url, index) => ({
                            url: url,
                            title: frontmatter.title, 
                            link: link, 
                            alt: `${frontmatter.title} (Image ${index + 1})`, 
                        }));
                        
                        results = results.concat(newImages);

                    } else {
                        console.warn(`⚠️ Article "${frontmatter.title}" (${relativePath}) marked for carousel but missing image URL.`);
                    }
                }
            }
        }
    } catch (e) {
        console.error(`❌ [Generate Script] File system operation failed or directory unreadable: ${dir}`, e);
    }

    return results;
}

// --- 主执行函数 ---
async function generateData() {
    console.log('--- Starting Carousel Data Generation (Build Time) ---');
    console.time('Data Generation');

    try {
        const carouselData = await crawlDirectory(ROOT_DIRECTORY);
        
        // 写入静态文件
        await fs.writeFile(OUTPUT_FILE, JSON.stringify(carouselData, null, 2), 'utf8');
        
        console.timeEnd('Data Generation');
        console.log(`✅ Successfully generated ${carouselData.length} carousel items.`);
        console.log(`   Data saved to: ${path.relative(process.cwd(), OUTPUT_FILE)}`);

    } catch (error) {
        console.error('❌ Failed to execute data generation script:', error);
        // 如果失败，抛出错误以中断构建
        process.exit(1); 
    }
}

generateData();
