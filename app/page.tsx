import { Container } from '@mantine/core';
//import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
//import { Content } from '@/components/Content/Content';
import { Welcome } from '@/components/Welcome/Welcome';
import { WorldClock } from '@/components/WorldClock/WorldClock'; // 导入世界时钟组件
export default function HomePage() {
  return (
    <Container mih="calc(100vh - 328px)">
      <Welcome />
      <WorldClock /> {/* 添加世界时钟 */}
      {/*<ColorSchemeToggle />
      <Content />*/}
    </Container>
  );
}
