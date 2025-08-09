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
  roles?: string[]; // Nouvelle propriété pour les rôles autorisés
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
        breadcrumbs: true,
        roles: ['ADMIN', 'CHEF_SERVICE_MAINTENANCE', 'CHEF_SERVICE_HOSPITALIER', 'CHEF_SERVICE_MAGASIN'] // ✅ AJOUTÉ

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
    id: 'interventionsUrgente',
    title: 'Intervention urgente',
    type: 'group',
    icon: 'feather icon-clipboard',
    children: [
      {
        id: 'Interventions',
        title: 'Interventions urgentes',
        type: 'item',
        url: '/interventionsUrgente',
        classes: 'nav-item text-danger fw-bold',
        icon: 'feather icon-alert-triangle',
        roles: ['ADMIN', 'TECHNICIEN_MAINTENANCE', 'CHEF_SERVICE_MAINTENANCE']

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
        icon: 'feather icon-activity',
        roles: ['ADMIN', 'TECHNICIEN_MAINTENANCE', 'CHEF_SERVICE_MAINTENANCE']

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
        url: '/listeusers',
        classes: 'nav-item',
        icon: 'feather icon-user-check',
        roles: ['ADMIN'] // 👈 ICI
      }
    ]
  }


];