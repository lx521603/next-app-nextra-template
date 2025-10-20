'use client';

import { Carousel, CarouselSlide } from '@mantine/carousel';
import { useEffect, useState } from 'react';
import '@mantine/carousel/styles.css';
import Link from 'next/link';
import { Box } from '@mantine/core'; // 引入 Box 组件以更好地控制样式

interface CarouselImage {
  url: string;
  alt: string;
  title: string;
  link: string;
}

export function HomeCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);

  // 备用图片数据
  function getFallbackImages(): CarouselImage[] {
    return [
      {
        url: 'https://picsum.photos/400/600?random=a', // 使用竖图
        alt: '测试竖图1',
        title: '测试竖图1',
        link: '/carousel/test/1', // 使用 /carousel/ 前缀
      },
      {
        url: 'https://picsum.photos/800/400?random=b', // 使用宽横图
        alt: '测试横图1',
        title: '测试横图1',
        link: '/carousel/test/2',
      },
      {
        url: 'https://picsum.photos/450/650?random=c', // 使用竖图
        alt: '测试竖图2',
        title: '测试竖图2',
        link: '/carousel/test/3',
      },
      {
        url: 'https://picsum.photos/750/500?random=d', // 使用标准横图
        alt: '测试横图2',
        title: '测试横图2',
        link: '/carousel/test/4',
      },
    ];
  }

  useEffect(() => {
    async function loadImages() {
      try {
        const response = await fetch('/api/carousel');

        if (!response.ok) {
          throw new Error(`API 请求失败: ${response.status}`);
        }

        const carouselImages: CarouselImage[] = await response.json();

        if (!carouselImages || carouselImages.length === 0) {
          setImages(getFallbackImages());
        } else {
          setImages(carouselImages);
        }
      } catch (error) {
        console.error('❌ 加载轮播图片失败，使用备用数据:', error);
        setImages(getFallbackImages());
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  if (loading) {
    return (
      <Box
        h={400} // 高度与 Carousel 保持一致
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          margin: '30px 0',
        }}
      >
        <div>加载图片中...</div>
      </Box>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Box
        h={400}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px dashed #dee2e6',
          margin: '30px 0',
        }}
      >
        <div>暂无展示图片</div>
      </Box>
    );
  }

  return (
    <Carousel
      withIndicators
      height={400} // 设置高度
      // 核心修改：增加 slideSize 到 90%，让图片占据更多空间
      slideSize="65%" 
      slideGap="md" 
      withControls
      emblaOptions={{
        loop: true,
        dragFree: false,
        align: 'center', // 居中对齐，突出主图
      }}
      style={{ margin: '30px 0' }}
    >
      {images.map((image, index) => (
        <CarouselSlide key={index}>
          <Link 
            href={image.link} 
            style={{ 
              display: 'block', 
              textDecoration: 'none', 
              height: '100%', // 使用 100% 填充父级 Carousel 的高度
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // 添加轻微阴影
            }}
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff', // 背景设为白色，以防 contain 模式下出现灰边
              }}
            >
              <img
                src={image.url}
                alt={image.alt}
                title={image.title} 
                style={{
                  width: '100%',
                  height: '100%',
                  // objectFit: 'contain' 确保图片完整显示
                  objectFit: 'contain', 
                  objectPosition: 'center',
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCI geG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2FkYjViYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBJQ1RVUkUgTE9BRElORyBGT1RPIEVSUk9SPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
            {/* 可以在这里添加一个叠加层来显示标题，但为了简化，我们暂时不加 */}
          </Link>
        </CarouselSlide>
      ))}
    </Carousel>
  );
}