// app/tags/page.tsx
import { Container, Title, Group, Badge, Text, SimpleGrid, Card } from '@mantine/core';
import { getAllTags, getAllPosts } from '../../lib/posts';
import { IconTags, IconArticle, IconStar } from '@tabler/icons-react';

// 使用 async 函数，但不使用 'use server'
export default async function TagsPage() {
  const tags = getAllTags();
  const allPosts = getAllPosts();
  
  const postsWithTags = allPosts.filter(post => post.tags && post.tags.length > 0);
  const totalTagUsage = Object.values(tags).reduce((sum, count) => sum + count, 0);
  
  // 按使用次数排序标签
  const sortedTags = Object.entries(tags).sort(([, a], [, b]) => b - a);

  return (
    <Container size="lg" py="xl">
      {/* 标题区域 */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-500 rounded-2xl">
            <IconTags size={32} className="text-white" />
          </div>
        </div>
        <Title order={1} className="text-blue-600 mb-4">
          内容标签
        </Title>
        <Text size="xl" c="dimmed">
          探索 {allPosts.length} 篇文章中的 {sortedTags.length} 个标签
        </Text>
      </div>

      {/* 数据统计卡片 */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconTags size={24} className="text-blue-600" />
            </div>
            <div>
              <Text fw={700} size="xl">{sortedTags.length}</Text>
              <Text c="dimmed" size="sm">标签数量</Text>
            </div>
          </div>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <IconArticle size={24} className="text-green-600" />
            </div>
            <div>
              <Text fw={700} size="xl">{postsWithTags.length}</Text>
              <Text c="dimmed" size="sm">带标签文章</Text>
            </div>
          </div>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <IconStar size={24} className="text-orange-600" />
            </div>
            <div>
              <Text fw={700} size="xl">{totalTagUsage}</Text>
              <Text c="dimmed" size="sm">标签使用次数</Text>
            </div>
          </div>
        </Card>
      </SimpleGrid>

      {/* 所有标签 */}
      <div>
        <Title order={2} mb="lg">所有标签</Title>
        <Group gap="md">
          {sortedTags.map(([tag, count]) => (
            <a
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              style={{ textDecoration: 'none' }}
            >
              <Badge 
                size="lg" 
                color="blue"
                variant="light"
                style={{ cursor: 'pointer' }}
              >
                {tag} 
                <Text span c="blue.6" ml={4} fw={700}>
                  {count}
                </Text>
              </Badge>
            </a>
          ))}
        </Group>
      </div>

      {/* 空状态 */}
      {sortedTags.length === 0 && (
        <Card shadow="md" padding="xl" radius="md" className="text-center border-dashed">
          <IconTags size={48} className="text-gray-400 mx-auto mb-4" />
          <Title order={3} mb="md">还没有标签</Title>
          <Text c="dimmed">
            在文章的 Front Matter 中添加 tags 字段来创建标签吧！
          </Text>
        </Card>
      )}
    </Container>
  );
}