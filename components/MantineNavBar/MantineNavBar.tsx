// components/MantineNavBar/MantineNavBar.tsx
'use client';

import { Navbar } from 'nextra-theme-docs';
import { Group, Text, Box } from '@mantine/core';
import { ColorSchemeControl } from '../ColorSchemeControl/ColorSchemeControl';
import { Logo } from '../Logo/Logo';
import { MantineNextraThemeObserver } from '../MantineNextraThemeObserver/MantineNextraThemeObserver';

export const MantineNavBar = () => {
  return (
    <Box key="mantine-navbar-container">
      <MantineNextraThemeObserver />
      <Navbar
        logo={
          <Group align="center" gap={4}>
            <Logo />
            <Text size="lg" fw={800} c="blue" visibleFrom="xl">
              Asura
            </Text>
          </Group>
        }
        chatLink="https://discord.com/invite/wbH82zuWMN"
        projectLink="https://github.com/gfazioli/next-app-nextra-template"
      >
        <Group key="navbar-controls" gap="md" align="center">
          <ColorSchemeControl />
          <Box 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              height: '32px'
            }}
          >
            <iframe
              src="https://github.com/sponsors/gfazioli/button"
              title="Sponsor gfazioli"
              height="32"
              width="114"
              style={{ 
                border: 0, 
                borderRadius: '6px',
                display: 'block'
              }}
            />
          </Box>
        </Group>
      </Navbar>
    </Box>
  );
};