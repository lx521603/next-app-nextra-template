import '@gfazioli/mantine-marquee/styles.layer.css';
import '@gfazioli/mantine-text-animate/styles.layer.css';
import '@mantine/core/styles.layer.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@gfazioli/mantine-clock/styles.css';
import './styles/custom-images.css';
import { Layout } from 'nextra-theme-docs';
import { Banner, Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { MantineFooter, MantineNavBar } from '@/components';
import config from '@/config';
import pack from '../package.json';
import { theme } from '../theme';
import './global.css';

export const metadata = config.metadata;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap();
  const { nextraLayout, head } = config;

  return (
    <html lang="en" dir="ltr" {...mantineHtmlProps}>
      <Head>
        <ColorSchemeScript
          nonce={head.mantine.nonce}
          defaultColorScheme={head.mantine.defaultColorScheme}
        />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </Head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme={head.mantine.defaultColorScheme}>
          <Layout
            key="nextra-layout"
            banner={
              <Banner key="banner" storageKey={`release-notes-${pack.version}`}>
                ✨ 点击访问-{' '}
                <a href="https://sorayt.com">薇薇日常</a>
              </Banner>
            }
            navbar={<MantineNavBar key="navbar" />}
            pageMap={pageMap}
            docsRepositoryBase={nextraLayout.docsRepositoryBase}
            footer={<MantineFooter key="footer" />}
            sidebar={nextraLayout.sidebar}
          >
            {children}
          </Layout>
        </MantineProvider>
      </body>
    </html>
  );
}