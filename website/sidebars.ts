import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Specification',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'introduction',
          label: '1. Introduction',
        },
        {
          type: 'doc',
          id: 'architecture',
          label: '2. Architecture',
        },
        {
          type: 'doc',
          id: 'core-components',
          label: '3. Core Components',
        },
      ],
    },
    {
      type: 'category',
      label: 'Protocol Layers',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'discovery',
          label: '4. Discovery',
        },
        {
          type: 'doc',
          id: 'negotiation',
          label: '5. Negotiation',
        },
        {
          type: 'doc',
          id: 'verification',
          label: '6. Verification',
        },
        {
          type: 'doc',
          id: 'settlement',
          label: '7. Settlement',
        },
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'trust-model',
          label: '8. Trust Model',
        },
        {
          type: 'doc',
          id: 'extensions',
          label: '9. Extensions',
        },
      ],
    },
  ],
};

export default sidebars;
