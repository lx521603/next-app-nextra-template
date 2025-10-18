// app/tags/[tag]/page.tsx
import { Container, Title, Stack, Text, Anchor } from '@mantine/core';
import { getPostsByTag, getAllTags } from '../../../lib/posts';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    tag: string;
  }>;
}

export default async function TagPage({ params }: Props) {
  // 使用 await 解析 params
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);
  
  if (posts.length === 0) {
    notFound();
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        标签: <Text span c="blue">{decodedTag}</Text>
      </Title>
      
      <Text c="dimmed" mb="xl">
        找到 {posts.length} 篇文章
      </Text>

      <Stack gap="lg">
        {posts.map((post) => (
          <div key={post.slug}>
            <Anchor 
              href={`/docs/${post.slug}`}
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

export async function generateStaticParams() {
  const tags = getAllTags();
  return Object.keys(tags).map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `标签: ${decodedTag}`,
    description: `包含"${decodedTag}"标签的所有文章`,
  };
}