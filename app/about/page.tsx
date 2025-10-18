// app/about/page.tsx
import { Container, Title, Text, SimpleGrid, Card } from '@mantine/core';

export default function AboutPage() {
  return (
    <Container size="lg" py="xl">
      {/* 标题区域 */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Title order={1} className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" mb="md">
          关于我们
        </Title>
        <Text size="lg" c="dimmed">
          小而精的团队，专注创造卓越体验
        </Text>
      </div>

      {/* 团队介绍 */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
        {/* 技术支持 - Sai */}
        <Card shadow="md" padding="xl" radius="md" withBorder>
          <div style={{ textAlign: 'center' }}>
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              💻
            </div>
            <Title order={3} mb="xs">Sai</Title>
            <Text c="blue" fw={500} mb="sm">技术支持</Text>
            <Text c="dimmed" size="sm">
              全栈开发专家，负责技术架构与产品实现。
              精通现代 Web 技术，确保系统稳定高效运行。
            </Text>
          </div>
        </Card>

        {/* 专业主播/运营 - 王薇薇 */}
        <Card shadow="md" padding="xl" radius="md" withBorder>
          <div style={{ textAlign: 'center' }}>
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              🎤
            </div>
            <Title order={3} mb="xs">王薇薇</Title>
            <Text c="purple" fw={500} mb="sm">专业主播 & 运营</Text>
            <Text c="dimmed" size="sm">
              内容创作与用户运营专家，负责品牌传播与用户互动。
              用专业的声音和内容连接每一个用户。
            </Text>
          </div>
        </Card>
      </SimpleGrid>

      {/* 合作流程 */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          padding: '2rem',
          borderRadius: '0.5rem',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Title order={2} mb="md">我们的合作模式</Title>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          {[
            { icon: '🎯', title: '需求分析', desc: '深入理解项目目标与用户需求' },
            { icon: '⚡', title: '技术实现', desc: 'Sai 负责技术开发与系统架构' },
            { icon: '🚀', title: '内容运营', desc: '薇薇负责内容创作与用户沟通' }
          ].map((item, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <Text fw={500} mb="xs">{item.title}</Text>
              <Text size="sm" c="blue.1">{item.desc}</Text>
            </div>
          ))}
        </SimpleGrid>
      </div>
    </Container>
  );
}