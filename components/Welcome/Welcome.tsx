'use client';

import { useState } from 'react';
import { TextAnimate } from '@gfazioli/mantine-text-animate';
import { IconBrandGithub, IconExternalLink, IconMessageCircle } from '@tabler/icons-react';
import { Anchor, Button, Center, Code, Paper, Text, Title, Modal } from '@mantine/core';
// import pack from '../../package.json';
// import { ProductHunt } from '../ProductHunt/ProductHunt';
import ContactForm from '@/components/ContactForm/ContactForm';
import classes from './Welcome.module.css';

export function Welcome() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      {/* 屏蔽 ProductHunt 部分 */}
      {/*
      <Center my={64}>
        <ProductHunt />
      </Center>
      */}
      
      <Title maw="90vw" mx="auto" className={classes.title} ta="center">
        欢迎来到我的基地
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
          gradient={{ from: 'pink', to: 'yellow' }}
        >
          Asura
        </TextAnimate>
      </Title>

      <Text c="dimmed" ta="center" size="xl" maw={580} mx="auto" mt="sm">
        在这个空间，我记录我的发现与灵感，也希望分享给同样热爱探索、喜欢尝鲜的朋友。每一次点击、每一次出发，都是一场新的探险。{' '}
        <Anchor href="https://mantine.dev/guides/next/">this guide</Anchor>. To get started edit{' '}
        <Code fz="xl">page.tsx</Code> file.
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

      {/*
      <Paper shadow="xl" p={8} mih={300} my={32} bg="dark.9" mx="auto" radius={8}>
        <TextAnimate.Typewriter
          inherit
          fz={11}
          c="green.5"
          ff="monospace"
          multiline
          delay={100}
          loop={false}
          value={[
            'Dependencies :',
            ...Object.keys(pack.dependencies).map(
              (key: string) =>
                `${key} : ${pack.dependencies[key as keyof typeof pack.dependencies].toString()}`
            ),
          ]}
        />
      </Paper>
      */}
    </>
  );
}
