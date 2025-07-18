export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;

  children?: NavigationItem[];
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboardd',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },
  
  {
    id: 'equipements',
    title: 'Equipements',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'equipements',
        title: 'Equipements ',
        type: 'item',
        url: '/equipements',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }]
  },
   {
    id: 'ListeUsers',
    title: 'ListeUsers',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'ListeUsers',
        title: 'Liste des utlisateurs ',
        type: 'item',
        url: '/listeusers',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }]
  },
  
   {
    id: 'Interventions',
    title: 'Interventions',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'ListeUsers',
        title: 'Historique des interventions ',
        type: 'item',
        url: '/interventions',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }]
  }
     
  
];
