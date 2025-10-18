import { Clock } from '@gfazioli/mantine-clock';
import { Group, Stack, Text } from '@mantine/core';

export function WorldClock() {  // 添加 export
  return (
    <Group justify="center" gap="xl">
      <Stack align="center" gap="sm">
        <Clock 
          timezone="Asia/Shanghai"
          size={200}
          secondHandBehavior="smooth"
          primaryNumbersProps={{ c: 'blue.6', fw: 600 }}
        />
        <Text fw={600} c="dimmed">
          上海
        </Text>
      </Stack>
      
      <Stack align="center" gap="sm">
        <Clock 
          timezone="America/Los_Angeles"
          size={200}
          secondHandBehavior="smooth"
          primaryNumbersProps={{ c: 'green.6', fw: 600 }}
        />
        <Text fw={600} c="dimmed">
          洛杉矶
        </Text>
      </Stack>
      
      <Stack align="center" gap="sm">
        <Clock 
          timezone="Europe/London"
          size={200}
          secondHandBehavior="smooth"
          primaryNumbersProps={{ c: 'orange.6', fw: 600 }}
        />
        <Text fw={600} c="dimmed">
          伦敦
        </Text>
      </Stack>
    </Group>
  );
}