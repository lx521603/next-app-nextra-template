// app/tags/[tag]/page.tsx
import { Container, Title, Stack, Text, Anchor } from '@mantine/core';
import { getPostsByTag, getAllTags } from '../../../lib/posts';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    tag: string;
  };
}

export default function TagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(tag);
  
  if (posts.length === 0) {
    notFound();
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        标签: <Text span c="blue">{tag}</Text>
      </Title>
      
      <Text c="dimmed" mb="xl">
        找到 {posts.length} 篇文章
      </Text>

      <Stack gap="lg">
        {posts.map((post) => (
          <div key={post.slug}>
            <Anchor 
              href={`/docs/${post.slug}`}  // 这里会根据 slug 生成正确链接
              size="xl"
              fw={600}
            >
              {post.title}
            </Anchor>
            <div style={{ marginTop: '0.5rem' }}>
              {post.tags.map(t => (
                <a
                  key={t}
                  href={`/tags/${encodeURIComponent(t)}`}
                  style={{ 
                    textDecoration: 'none',
                    marginRight: '0.5rem'
                  }}
                >
                  <Text span size="sm" c="blue" style={{ cursor: 'pointer' }}>
                    #{t}
                  </Text>
                </a>
              ))}
            </div>
          </div>
        ))}
      </Stack>
    </Container>
  );
}