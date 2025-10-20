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
        chatLink="https://discord.gg/4w9jtU3AB"
        projectLink="https://github.com/lx521603/next-app-nextra-template"
      >
        <Group key="navbar-controls" gap="md" align="center">
          {/* 明暗切换按钮 (ColorSchemeControl) 保持在所有尺寸可见 */}
          <ColorSchemeControl />
          
          {/* Sponsor Iframe 容器：使用 Mantine 的 visibleFrom="sm" 属性 */}
          {/* 这将确保在移动设备上隐藏 iframe，只在平板及更大屏幕上显示 */}
          <Box 
            visibleFrom="sm" // 优化：在屏幕尺寸小于 'sm' 时隐藏此 Box
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              height: '32px'
            }}
          >
           {/*} <iframe
              src="https://github.com/sponsors/lx521603/button"
              title="Sponsor lx521603"
              height="32"
              width="114"
              style={{ 
                border: 0, 
                borderRadius: '6px',
                display: 'block'
              }}
            />*/}
          </Box>
        </Group>
      </Navbar>
    </Box>
  );
};
