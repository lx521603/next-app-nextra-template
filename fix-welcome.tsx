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
          color: 'var(--mantine-color-blue-filled)'
        }}
      >
        欢迎来到我的基地{' '}
        <TextAnimate
          animate="in"
          by="character"
          text="ouro.life"
          delay={0.5}
          segmentDelay={0.2}
          duration={2}
          animation="scale"
          animateProps={{ scaleAmount: 3 }}
          gradient={{ from: 'pink', to: 'yellow' }}
        />
      </Title>

      <Text c="dimmed" ta="center" size="lg" maw="80vw" mx="auto" mt="xl">
        分享有用的知识片段和代码，做有价值的事情。
      </Text>

      <Center mt="xl">
        <Button
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
          size="lg"
          radius="md"
          leftSection={<IconMessageCircle size={20} />}
          onClick={() => setOpened(true)}
        >
          给我留言
        </Button>
      </Center>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="联系我"
        size="lg"
        centered
      >
        <ContactForm />
      </Modal>
    </>
  );
}
