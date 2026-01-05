const fs = require('fs');
const content = fs.readFileSync('src/layouts/partials/Testimonial.astro', 'utf8');

// 检查导入
if (content.includes('import { Swiper')) {
  console.log('✅ 包含 Swiper 导入');
} else {
  console.log('❌ 缺少 Swiper 导入');
}

// 检查数据引用
if (content.includes('testimonial.data.testimonials')) {
  console.log('✅ 正确引用 testimonials 数据');
} else {
  console.log('❌ 数据引用可能有问题');
}

// 检查 astro-swiper 组件使用
if (content.includes('<Swiper')) {
  console.log('✅ 使用 astro-swiper 组件');
} else {
  console.log('❌ 未使用 astro-swiper 组件');
}
