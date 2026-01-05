const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// 如果没有 chokidar，先安装：npm install chokidar
try {
  require('chokidar');
} catch {
  console.log('请先安装 chokidar: npm install chokidar');
  process.exit(1);
}

const { getAllPosts, getPostsWithGallery } = require('../lib/posts');

function updateCarouselData() {
  console.log('[Carousel] 检测到内容变化，更新数据...');
  
  try {
    const galleryPosts = getPostsWithGallery();
    const allPosts = getAllPosts();
    
    let posts = galleryPosts;
    if (posts.length === 0) {
      posts = allPosts.filter(p => p.featured);
    }
    if (posts.length === 0) {
      posts = allPosts.slice(0, 5);
    }
    
    const carouselData = posts.slice(0, 5).map(post => {
      let imageUrl = 'https://picsum.photos/800/400?random=carousel';
      if (post.gallery && post.gallery.length > 0) {
        imageUrl = post.gallery[0];
      } else if (post.coverImage) {
        imageUrl = post.coverImage;
      }
      
      return {
        url: imageUrl,
        alt: post.title || '文章图片',
        title: post.title || '未命名文章',
        link: `/docs/${post.slug}`
      };
    });
    
    const outputPath = path.join(process.cwd(), 'public', 'carousel_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(carouselData, null, 2));
    
    console.log(`[Carousel] 数据已更新: ${carouselData.length} 项`);
    console.log(`[Carousel] 文件: ${outputPath}`);
    
  } catch (error) {
    console.error('[Carousel] 更新失败:', error);
  }
}

// 监听 content 目录变化
const contentDir = path.join(process.cwd(), 'content');
console.log(`[Carousel] 开始监听: ${contentDir}`);

const watcher = chokidar.watch(contentDir, {
  ignored: /(^|[\/\\])\../, // 忽略隐藏文件
  persistent: true,
  ignoreInitial: true
});

watcher
  .on('add', path => {
    console.log(`[Carousel] 文件添加: ${path}`);
    updateCarouselData();
  })
  .on('change', path => {
    console.log(`[Carousel] 文件修改: ${path}`);
    updateCarouselData();
  })
  .on('unlink', path => {
    console.log(`[Carousel] 文件删除: ${path}`);
    updateCarouselData();
  });

console.log('[Carousel] 监听器已启动，按 Ctrl+C 停止');
