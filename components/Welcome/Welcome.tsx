'use client';

import { useState } from 'react';
import { TextAnimate } from '@gfazioli/mantine-text-animate';
import { IconMessageCircle, IconExternalLink } from '@tabler/icons-react';
import { Button, Center, Text, Title, Modal } from '@mantine/core';
import ContactForm from '@/components/ContactForm/ContactForm';
import classes from './Welcome.module.css';

export function Welcome() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Title 
        maw="90vw" 
        mx="auto" 
        className={classes.title} 
        ta="center" 
        style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700,
          lineHeight: 1.2,
          color: 'var(--mantine-color-blue-filled)' // 使用主题的蓝色
        }}
      >
        欢迎来到我的基地{' '}
        <TextAnimate
          animate="in"
          by="character"
          inherit
          variant="gradient"
          component="span"
          segmentDelay={0.2}
          duration={2}
          animation="scale"
          animateProps={{ scaleAmount: 3 }}
          gradient={{ from: 'pink', to: 'yellow' }} // Asura 保持原来的粉红到黄色
          style={{ 
            fontSize: 'inherit', 
            fontWeight: 'inherit',
            fontFamily: 'inherit',
            lineHeight: 'inherit'
          }}
        >
          Asura
        </TextAnimate>
      </Title>

      <Text 
        c="dimmed" 
        ta="center" 
        maw={580} 
        mx="auto" 
        mt="sm" 
        style={{ 
          fontSize: '1.25rem',
          lineHeight: 1.5 
        }}
      >
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