import { Container } from '@mantine/core';
import { Welcome } from '@/components/Welcome/Welcome';
import { WorldClock } from '@/components/WorldClock/WorldClock';
import { HomeCarousel } from '@/components/Carousel/Carousel'; // 修改导入名
//import { Content } from '@/components/Content/Content';

export default function HomePage() {
  return (
    <Container mih="calc(100vh - 328px)">
      <Welcome />
      <HomeCarousel /> {/* 使用新名称 */}
      <WorldClock />
      {/*<Content />*/}
    </Container>
  );
}