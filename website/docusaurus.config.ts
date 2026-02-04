import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Liquid Context Protocol',
  tagline: 'Open protocol specification for autonomous AI context orchestration',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://turf-tech.github.io',
  baseUrl: '/lcp-spec/',

  organizationName: 'Turf-Tech',
  projectName: 'lcp-spec',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
          editUrl: 'https://github.com/Turf-Tech/lcp-spec/tree/main/website/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/lcp-social-card.png',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Liquid Context Protocol',
        src: 'img/logo-text.svg',
        srcDark: 'img/logo-text.svg',
        width: 180,
        height: 60,
      },
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://turf-tech.github.io/lcp-spec',
          label: 'Website',
          position: 'left',
        },
        {
          href: 'https://github.com/Turf-Tech/lcp-spec',
          label: 'GitHub',
          position: 'right',
          className: 'header-github-link',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Specification',
              to: '/docs/introduction',
            },
            {
              label: 'Examples',
              href: 'https://github.com/Turf-Tech/lcp-spec/tree/main/examples',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Turf-Tech/lcp-spec',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/Turf-Tech/lcp-spec/discussions',
            },
            {
              label: 'Issues',
              href: 'https://github.com/Turf-Tech/lcp-spec/issues',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Contributing',
              href: 'https://github.com/Turf-Tech/lcp-spec/blob/main/CONTRIBUTING.md',
            },
            {
              label: 'Roadmap',
              href: 'https://github.com/Turf-Tech/lcp-spec/blob/main/ROADMAP.md',
            },
            {
              label: 'Governance',
              href: 'https://github.com/Turf-Tech/lcp-spec/blob/main/GOVERNANCE.md',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Turf Tech. Licensed under MIT.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['json', 'solidity', 'typescript'],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
