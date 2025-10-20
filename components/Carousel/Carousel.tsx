'use client';

import { Carousel, CarouselSlide } from '@mantine/carousel';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useInterval } from '@mantine/hooks';
import '@mantine/carousel/styles.css';
import Link from 'next/link';
import { Box } from '@mantine/core';
import { EmblaCarouselType } from 'embla-carousel';

interface CarouselImage {
  url: string;
  alt: string;
  title: string;
  link: string;
}

export function HomeCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);

  // 自动播放逻辑 - 减少到 3000 毫秒（3秒）
  const interval = useInterval(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, 2000); // 从 4000 减少到 3000

  // Embla 初始化处理器
  const handleEmblaInit = useCallback((api: EmblaCarouselType) => {
    setEmblaApi(api);
  }, []);

  // 启动和停止自动播放
  useEffect(() => {
    if (!loading && images.length > 0 && emblaApi) {
      interval.start();
      return interval.stop;
    }
  }, [loading, images.length, emblaApi, interval]);

  // 鼠标悬停控制
  const handleMouseEnter = useCallback(() => {
    interval.stop();
  }, [interval]);

  const handleMouseLeave = useCallback(() => {
    if (!loading && images.length > 0) {
      interval.start();
    }
  }, [interval, loading, images.length]);

  // 备用图片数据
  function getFallbackImages(): CarouselImage[] {
    return [
      { url: 'https://picsum.photos/400/600?random=a', alt: '测试竖图1', title: '测试竖图1', link: '/carousel/test/1' },
      { url: 'https://picsum.photos/800/400?random=b', alt: '测试横图1', title: '测试横图1', link: '/carousel/test/2' },
      { url: 'https://picsum.photos/450/650?random=c', alt: '测试竖图2', title: '测试竖图2', link: '/carousel/test/3' },
      { url: 'https://picsum.photos/750/500?random=d', alt: '测试横图2', title: '测试横图2', link: '/carousel/test/4' },
    ];
  }

  // 数据加载逻辑
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
        h={400}
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
      getEmblaApi={handleEmblaInit}
      withIndicators
      height={400}
      slideSize="65%"
      slideGap="md"
      withControls
      // 修复 loop 属性 - 使用 emblaOptions 来设置
      emblaOptions={{
        loop: true,  // 在这里设置 loop
        align: 'center',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ margin: '30px 0' }}
    >
      {images.map((image, index) => (
        <CarouselSlide key={index}>
          <Link 
            href={image.link} 
            style={{ 
              display: 'block', 
              textDecoration: 'none', 
              height: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
              }}
            >
              <img
                src={image.url}
                alt={image.alt}
                title={image.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
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