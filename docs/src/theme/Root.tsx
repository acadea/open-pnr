import { MantineProvider } from '@mantine/core';

// Default implementation, that you can customize
export default function Root({ children }) {
  
  return <MantineProvider>{children}</MantineProvider>;
}