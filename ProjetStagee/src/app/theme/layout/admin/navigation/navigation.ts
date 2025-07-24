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
    title: 'Navigation Principale',
    type: 'group',
    icon: 'feather icon-compass',
    children: [
      {
        id: 'dashboard',
        title: 'Tableau de Bord',
        type: 'item',
        url: '/dashboardd', // Gardé tel quel comme dans votre original
        icon: 'feather icon-pie-chart',
        classes: 'nav-item',
        breadcrumbs: true
      }
    ]
  },
  
  {
    id: 'equipements',
    title: 'Gestion des Équipements',
    type: 'group',
    icon: 'feather icon-cpu',
    children: [
      {
        id: 'equipements',
        title: 'Inventaire des Équipements',
        type: 'item',
        url: '/equipements', // URL originale conservée
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  },
  
  {
    id: 'utilisateurs',
    title: 'Gestion du Personnel',
    type: 'group',
    icon: 'feather icon-users',
    children: [
      {
        id: 'liste-utilisateurs',
        title: 'Gestion des Utilisateurs',
        type: 'item',
        url: '/listeusers', // URL originale conservée
        classes: 'nav-item',
        icon: 'feather icon-user-check'
      }
    ]
  },
  
  {
    id: 'interventions',
    title: 'Suivi des Interventions',
    type: 'group',
    icon: 'feather icon-clipboard',
    children: [
      {
        id: 'historique-interventions',
        title: 'Journal des Interventions',
        type: 'item',
        url: '/interventions', // URL originale conservée
        classes: 'nav-item',
        icon: 'feather icon-activity'
      }
    ]
  }
];