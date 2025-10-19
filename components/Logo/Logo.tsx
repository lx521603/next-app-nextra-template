import { IconPlayCardA } from '@tabler/icons-react';
import { useMantineTheme } from '@mantine/core';

export function Logo() {
  const theme = useMantineTheme();

  return <IconPlayCardA size={48} color={theme.colors.blue[5]} />;
}
