// components/WorldClock/WorldClock.tsx
'use client';

import { Clock } from '@gfazioli/mantine-clock';
import { Group, Stack, Text } from '@mantine/core';

export function WorldClock() {
  return (
    <Group grow>
      <Stack align="center">
        <Clock 
          timezone="Asia/Shanghai" 
          size={200} 
          showSeconds
        />
        <Text fw={600} c="dimmed">
          上海
        </Text>
      </Stack>

      <Stack align="center">
        <Clock 
          timezone="America/Los_Angeles" 
          size={200} 
          showSeconds
        />
        <Text fw={600} c="dimmed">
          洛杉矶
        </Text>
      </Stack>

      <Stack align="center">
        <Clock 
          timezone="Europe/London" 
          size={200} 
          showSeconds
        />
        <Text fw={600} c="dimmed">
          伦敦
        </Text>
      </Stack>
    </Group>
  );
}

export default WorldClock;