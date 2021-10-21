import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: '1. Maintain',
    url: '/temperature',
    icon: 'icon-note',
    children: [
      // {
      //   name: '1.1 Device',
      //   url: '/temperature/maintain-device',
      //   class: "menu-margin"
      // },
      // {
      //   name: '1.2 Location',
      //   url: '/temperature/maintain-location',
      //   class: "menu-margin"
      // },
      // {
      //   name: '1.3 Device Location',
      //   url: '/temperature/maintain-dl',
      //   class: "menu-margin"
      // },
    ]
  },
  {
    name: '3. Kanban',
    url: '/temperature',
    icon: 'icon-speedometer',
    children: [
      {
        name: '3.1 Kanban',
        url: '/temperature/kanban',
        class: "menu-margin"
      },
    ]
  },
  {
    name: '5. Query',
    url: '/temperature',
    icon: 'icon-graph',
    children: [
      {
        name: '5.1 Query',
        url: '/temperature/query',
        class: "menu-margin"
      },
    ]
  },

];
