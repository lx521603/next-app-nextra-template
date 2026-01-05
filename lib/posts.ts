import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface Post {
  slug: string;
  title: string;
  tags: string[];
  gallery?: string[];
  featured?: boolean;
  date?: string;
  excerpt?: string;
  coverImage?: string;
}

// 递归获取所有 MDX 文件
function getAllMdxFiles(dir: string = contentDirectory): string[] {
  const files: string[] = [];
  
  function scanDirectory(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      if (item.startsWith('_') || item === '.DS_Store') continue;
      
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

export function getAllPosts(): Post[] {
  try {
    console.log('🔍 扫描 content 目录...');
    
    const allMdxFiles = getAllMdxFiles();
    console.log(`📁 找到 ${allMdxFiles.length} 个 MDX 文件`);
    
    const posts: Post[] = [];
    let galleryCount = 0;
    
    for (const fullPath of allMdxFiles) {
      const relativePath = path.relative(contentDirectory, fullPath);
      const slug = relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/');
      
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        if (!fileContents.startsWith('---')) {
          continue;
        }
        
        const matterResult = matter(fileContents);
        const data = matterResult.data;
        
        // 处理 tags
        let tags: string[] = [];
        if (data.tags) {
          if (Array.isArray(data.tags)) {
            tags = data.tags;
          } else if (typeof data.tags === 'string') {
            tags = data.tags.split(',').map(tag => tag.trim());
          }
        }
        
        // 处理 gallery
        let gallery: string[] = [];
        if (data.gallery) {
          console.log(`🖼️  发现 gallery 在 ${slug}`);
          
          if (Array.isArray(data.gallery)) {
            gallery = data.gallery.filter(img => img && typeof img === 'string').map(img => img.trim());
            console.log(`   ✅ gallery 是数组，有 ${gallery.length} 张图片`);
          } else if (typeof data.gallery === 'string') {
            const galleryStr = data.gallery;
            if (galleryStr.includes('- ')) {
              gallery = galleryStr.split('\n')
                .map(line => line.trim())
                .filter(line => line.startsWith('- '))
                .map(line => line.substring(2).trim());
            } else if (galleryStr.includes(',')) {
              gallery = galleryStr.split(',').map(img => img.trim());
            } else {
              gallery = [galleryStr.trim()];
            }
            console.log(`   ✅ gallery 是字符串，解析出 ${gallery.length} 张图片`);
          }
          
          if (gallery.length > 0) {
            galleryCount++;
          }
        }
        
        const post: Post = {
          slug,
          title: data.title || path.basename(slug),
          tags,
          gallery: gallery.length > 0 ? gallery : undefined,
          featured: data.featured === true || data.highlight === true || data.spotlight === true,
          date: data.date,
          excerpt: data.excerpt || data.description,
          coverImage: data.coverImage || data.image
        };
        
        posts.push(post);
        
      } catch (error) {
        // TypeScript 修复：安全地获取错误信息
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        console.error(`❌ 处理文件失败 ${relativePath}:`, errorMessage);
      }
    }
    
    console.log(`✅ 扫描完成: ${posts.length} 篇文章，${galleryCount} 篇有 gallery`);
    
    return posts;
    
  } catch (error) {
    // TypeScript 修复：安全地获取错误信息
    const errorMessage = error instanceof Error ? error.message : '扫描目录失败';
    console.error('❌ 扫描目录失败:', errorMessage);
    return [];
  }
}

export function getPostsWithGallery(): Post[] {
  const posts = getAllPosts();
  return posts.filter(post => post.gallery && post.gallery.length > 0);
}

export function getFeaturedPosts(): Post[] {
  const posts = getAllPosts();
  return posts.filter(post => post.featured);
}

export function getAllTags(): Record<string, number> {
  const posts = getAllPosts();
  const allTags: string[] = [];
  
  posts.forEach(post => {
    if (post.tags && post.tags.length > 0) {
      allTags.push(...post.tags);
    }
  });
  
  const tagCounts: Record<string, number> = {};
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  
  return tagCounts;
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts();
  return posts.filter(post => post.tags.includes(tag));
}
