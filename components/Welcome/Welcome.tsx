'use client';

import { useState } from 'react';
import { IconBrandGithub, IconExternalLink, IconMessageCircle } from '@tabler/icons-react';
import { Anchor, Button, Center, Code, Paper, Text, Title, Modal } from '@mantine/core';
import ContactForm from '@/components/ContactForm/ContactForm';
import classes from './Welcome.module.css';

export function Welcome() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Title maw="90vw" mx="auto" className={classes.title} ta="center" size="2rem" fw={700}>
        欢迎来到我的基地{' '}
        <Text 
          component="span" 
          variant="gradient" 
          gradient={{ from: 'pink', to: 'yellow' }}
          inherit
          style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
        >
          Asura
        </Text>
      </Title>

      <Text c="dimmed" ta="center" size="xl" maw={580} mx="auto" mt="sm" fz="1.25rem">
        在这个空间，我记录我的发现与灵感，也希望分享给同样热爱探索、喜欢尝鲜的朋友。每一次点击、每一次出发，都是一场新的探险。
      </Text>

      <Center>
        <Button
          onClick={() => setOpened(true)}
          leftSection={<IconMessageCircle />}
          rightSection={<IconExternalLink />}
          variant="outline"
          px={32}
          radius={256}
          size="lg"
          mx="auto"
          mt="xl"
        >
          给我留言
        </Button>
      </Center>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="给我留言"
        size="lg"
      >
        <ContactForm />
      </Modal>
    </>
  );
}