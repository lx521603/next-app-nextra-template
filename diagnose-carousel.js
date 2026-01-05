const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

console.log('🔍 Carousel 数据诊断\n');

// 1. 检查静态 JSON 文件
console.log('=== 1. 检查静态 carousel_data.json ===');
const staticPath = path.join(process.cwd(), 'public', 'carousel_data.json');
if (fs.existsSync(staticPath)) {
  const staticData = JSON.parse(fs.readFileSync(staticPath, 'utf8'));
  console.log(`静态文件有 ${staticData.length} 个项目:`);
  staticData.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.title} - ${item.url}`);
  });
} else {
  console.log('❌ 静态文件不存在');
}

// 2. 检查所有文章的 frontmatter
console.log('\n=== 2. 扫描所有文章 frontmatter ===');
const contentDir = path.join(process.cwd(), 'content');
const mdxFiles = [];

function scanForMdx(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item.startsWith('_') || item === '.DS_Store') continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanForMdx(fullPath);
    } else if (item.endsWith('.mdx')) {
      mdxFiles.push(fullPath);
    }
  }
}

if (fs.existsSync(contentDir)) {
  scanForMdx(contentDir);
  console.log(`找到 ${mdxFiles.length} 篇 MDX 文章`);
  
  let hasGalleryCount = 0;
  let hasCoverImageCount = 0;
  let featuredCount = 0;
  
  console.log('\n=== 文章 frontmatter 详情 ===');
  mdxFiles.forEach((file, index) => {
    const relativePath = path.relative(contentDir, file);
    const content = fs.readFileSync(file, 'utf8');
    
    if (content.startsWith('---')) {
      const result = matter(content);
      const data = result.data;
      
      const hasGallery = data.gallery && (Array.isArray(data.gallery) ? data.gallery.length > 0 : data.gallery.trim() !== '');
      const hasCoverImage = !!data.coverImage || !!data.image;
      const isFeatured = data.featured === true || data.highlight === true || data.spotlight === true;
      
      if (hasGallery) hasGalleryCount++;
      if (hasCoverImage) hasCoverImageCount++;
      if (isFeatured) featuredCount++;
      
      console.log(`\n📄 ${index + 1}. ${relativePath}`);
      console.log(`   标题: ${data.title || '无标题'}`);
      console.log(`   gallery: ${hasGallery ? '✅' : '❌'} ${data.gallery ? (Array.isArray(data.gallery) ? `${data.gallery.length}张` : data.gallery) : ''}`);
      console.log(`   coverImage: ${hasCoverImage ? '✅' : '❌'} ${data.coverImage || data.image || ''}`);
      console.log(`   featured/highlight: ${isFeatured ? '✅' : '❌'}`);
      console.log(`   标签: ${data.tags ? (Array.isArray(data.tags) ? data.tags.join(', ') : data.tags) : '无'}`);
      
      // 如果 frontmatter 有 gallery，显示具体内容
      if (hasGallery) {
        console.log(`   gallery 内容:`);
        if (Array.isArray(data.gallery)) {
          data.gallery.forEach((img, i) => console.log(`      ${i + 1}. ${img}`));
        } else {
          console.log(`      ${data.gallery}`);
        }
      }
    }
  });
  
  console.log('\n=== 统计 ===');
  console.log(`有 gallery 的文章: ${hasGalleryCount} 篇`);
  console.log(`有 coverImage 的文章: ${hasCoverImageCount} 篇`);
  console.log(`有 featured 标记的文章: ${featuredCount} 篇`);
  
} else {
  console.log('❌ content 目录不存在');
}

// 3. 测试 lib/posts.ts 的获取逻辑
console.log('\n=== 3. 测试 lib/posts.ts 逻辑 ===');
try {
  const { getAllPosts, getPostsWithGallery } = require('./lib/posts');
  
  const allPosts = getAllPosts();
  const galleryPosts = getPostsWithGallery();
  
  console.log(`lib/posts.ts 报告:`);
  console.log(`  总文章数: ${allPosts.length}`);
  console.log(`  有 gallery 的文章数: ${galleryPosts.length}`);
  
  if (galleryPosts.length > 0) {
    console.log('\n有 gallery 的文章详情:');
    galleryPosts.forEach((post, i) => {
      console.log(`  ${i + 1}. ${post.title}`);
      console.log(`     slug: ${post.slug}`);
      console.log(`     gallery 数量: ${post.gallery ? post.gallery.length : 0}`);
      if (post.gallery) {
        post.gallery.forEach((img, j) => console.log(`       ${j + 1}. ${img}`));
      }
    });
  }
} catch (error) {
  console.log(`❌ 无法测试 lib/posts.ts: ${error.message}`);
}
