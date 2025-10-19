'use client';

import { Carousel, CarouselSlide } from '@mantine/carousel';
import { useEffect, useState } from 'react';
import '@mantine/carousel/styles.css';
import Link from 'next/link';

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
        url: 'https://img.sorayt.cn/f/jzu1/vv2.jpg',
        alt: '测试竖图1',
        title: '测试竖图1',
        link: '/carousel/test/1', // 使用 /carousel/ 前缀
      },
      {
        url: 'https://picsum.photos/600/400?random=1',
        alt: '测试横图1',
        title: '测试横图1',
        link: '/carousel/test/2',
      },
      {
        url: 'https://img.sorayt.cn/f/jzu1/vv2.jpg',
        alt: '测试竖图2',
        title: '测试竖图2',
        link: '/carousel/test/3',
      },
      {
        url: 'https://picsum.photos/600/400?random=2',
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
      <div
        style={{
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <div>加载图片中...</div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px dashed #dee2e6',
        }}
      >
        <div>暂无展示图片</div>
      </div>
    );
  }

  return (
    <Carousel
      withIndicators
      height={400}
      slideSize="70%"
      slideGap="md"
      withControls
      emblaOptions={{
        loop: true,
        dragFree: false,
        align: 'center',
      }}
      style={{ margin: '30px 0' }}
    >
      {images.map((image, index) => (
        <CarouselSlide key={index}>
          {/* 🚀 修复点：移除了 legacyBehavior，直接将样式应用到 Link 内部的 div 上 */}
          <Link 
            href={image.link} 
            style={{ 
              display: 'block', 
              textDecoration: 'none', 
              height: 350,
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
              }}
            >
              <img
                src={image.url}
                alt={image.alt}
                title={image.title} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2FkYjViYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBJQ1RVUkUgTE9BRElORyBGT1RPIEVSUk9SPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
          </Link>
        </CarouselSlide>
      ))}
    </Carousel>
  );
}
