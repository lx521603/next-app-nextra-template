// app/not-found.tsx
'use client';

import { Button, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import Link from 'next/link';
// 导入 CSS 文件，路径根据您的要求调整为 app/styles
import classes from './styles/NotFoundImage.module.css';

// 必须使用 export default 导出，并且组件名必须大写开头
export default function NotFound() {
  // 404.svg 放在 public 目录下，因此直接引用路径 /404.svg
  const imagePath = '/404.svg'; 

  return (
    // 使用 className={classes.root} 来应用全屏居中样式
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        {/* 移动端图片 */}
        <Image 
          src={imagePath} 
          className={classes.mobileImage} 
          alt="404 Not Found Illustration" 
        />
        
        {/* 文本内容 */}
        <div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text c="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </Text>
          
          {/* 返回首页按钮 */}
          <Button 
            component={Link} // 使用 next/link 进行路由跳转
            href="/" 
            variant="outline" 
            size="md" 
            mt="xl" 
            className={classes.control}
          >
            Get back to home page
          </Button>
        </div>
        
        {/* 桌面端图片 */}
        <Image 
          src={imagePath} 
          className={classes.desktopImage} 
          alt="404 Not Found Illustration" 
        />
      </SimpleGrid>
    </Container>
  );
}
