import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
// import '@mantine/core/styles.css';
// import '@mantine/code-highlight/styles.css';

const config: Config = {
  title: 'Open Sourced PNR Converter for Amadeus - Open PNR',
  tagline: 'A free and open sourced JavaScript library to convert Amadeus PNR into JSON.',
  favicon: 'img/favicon.ico',

  // TODO: Set the production url of your site here
  url: 'https://acadea.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/open-pnr',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'acadea', // Usually your GitHub org/user name.
  projectName: 'open-pnr', // Usually your repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: [
            './node_modules/@mantine/core/styles.css',
            './node_modules/@mantine/code-highlight/styles.css',
            './src/css/custom.css'
          ],
        },
        googleAnalytics: {
          trackingID: 'G-1Y1CMNJ35K',
        },
        // googleTagManager: {
        //   containerId: ''
        // }
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo.png',
    metadata: [{
      name: 'google-site-verification',
      content: 'hlfH7nVjAP1cuc73EscAihxFNOP1VzipSKYQCtC1ZOw', 
    }],
    navbar: {
      title: 'Open PNR',
      logo: {
        alt: 'Open PNR logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/acadea/open-pnr',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'Documentation',
              to: '/docs/intro',
            },
            {
              label: 'Acadea Learn',
              href: 'https://www.acadea.io/learn',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Youtube',
              href: 'https://www.youtube.com/@Acadeaio',
            },
            {
              label: 'Medium',
              href: 'https://medium.com/@sam-ngu',
            },
            // {
            //   label: 'Discord',
            //   href: 'https://discordapp.com/invite/docusaurus',
            // },
            
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy',
              href: 'https://www.acadea.io/privacy/',
            },
            {
              label: 'Terms',
              href: 'https://www.acadea.io/terms/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Acadea.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
