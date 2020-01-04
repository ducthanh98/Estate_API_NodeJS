import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Amentities',
    url: '/amentities',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'List Amentities',
        url: '/amentities',
        icon: 'icon-list'
      }
    ]
  },
  {
    name: 'Report',
    url: '/report-type',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'List Report Type',
        url: '/report-type',
        icon: 'icon-list'
      },
      {
        name: 'List Report',
        url: '/report',
        icon: 'icon-list'
      },
    ]
  },
  {
    name: 'User',
    url: '/user',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'List User',
        url: '/user',
        icon: 'icon-list'
      }
    ]
  },
  {
    name: 'Charts',
    url: '/charts',
    icon: 'icon-pie-chart'
  },
];
