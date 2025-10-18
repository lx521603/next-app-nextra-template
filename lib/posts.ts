// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface Post {
  slug: string;
  title: string;
  tags: string[];
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
    console.log('🔍 开始扫描 content 目录（包含子目录）...');
    
    const allMdxFiles = getAllMdxFiles();
    console.log('📁 找到的 MDX 文件:', allMdxFiles);
    
    const posts: Post[] = [];
    
    for (const fullPath of allMdxFiles) {
      // 计算相对于 content 目录的路径作为 slug
      const relativePath = path.relative(contentDirectory, fullPath);
      const slug = relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/');
      
      console.log(`\n🔍 处理文件: ${relativePath}`);
      console.log(`📁 完整路径: ${fullPath}`);
      console.log(`🔗 生成的slug: ${slug}`);
      
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        console.log(`✅ 文件读取成功，大小: ${fileContents.length} 字符`);
        
        if (!fileContents.startsWith('---')) {
          console.log(`❌ 跳过: 文件不以 --- 开头`);
          console.log(`📝 文件开头: ${fileContents.substring(0, 50)}`);
          continue;
        }
        
        console.log(`✅ 检测到 Front Matter`);
        
        const matterResult = matter(fileContents);
        console.log('📄 Front Matter 数据:', matterResult.data);
        console.log('🔑 Front Matter 键:', Object.keys(matterResult.data));
        
        const title = matterResult.data.title || path.basename(slug);
        let tags: string[] = [];
        
        if (matterResult.data.tags) {
          console.log(`🏷️  找到 tags 字段:`, matterResult.data.tags);
          console.log(`🔍 tags 类型:`, typeof matterResult.data.tags);
          
          if (Array.isArray(matterResult.data.tags)) {
            tags = matterResult.data.tags;
            console.log(`✅ 标签是数组:`, tags);
          } else if (typeof matterResult.data.tags === 'string') {
            tags = matterResult.data.tags.split(',').map(tag => tag.trim());
            console.log(`🔄 标签是字符串，分割后:`, tags);
          }
        } else {
          console.log(`❌ 没有 tags 字段`);
        }
        
        const post: Post = {
          slug: slug,
          title,
          tags
        };
        
        posts.push(post);
        console.log(`✅ 添加文章: ${title}, 标签: ${tags.join(', ')}`);
        
      } catch (error) {
        console.error(`❌ 处理文件失败:`, error);
      }
    }
    
    console.log('=== 最终统计 ===');
    console.log('找到文章数量:', posts.length);
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.slug}) - 标签: ${post.tags.join(', ')}`);
    });
    
    return posts;
    
  } catch (error) {
    console.error('❌ 扫描目录失败:', error);
    return [];
  }
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
  
  console.log('📊 标签统计:', tagCounts);
  return tagCounts;
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts();
  return posts.filter(post => post.tags.includes(tag));
}