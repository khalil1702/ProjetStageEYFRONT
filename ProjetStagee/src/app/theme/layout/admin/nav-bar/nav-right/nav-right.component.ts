import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbDropdownModule, NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role, Utilisateur } from 'src/app/models/Utilisateur';
import { AuthService } from 'src/app/services/authService';
import { FormsModule } from '@angular/forms';
import { EquipementService } from 'src/app/services/equipement';
import { Equipement } from 'src/app/models/Equipement';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, FormsModule],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  user!: Utilisateur | null;
  notifications: Notification[] = [];

  // Anciennes méthodes conservées
  @ViewChild('changePasswordModal') changePasswordModal!: TemplateRef<any>;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    config: NgbDropdownConfig,
    private equipementService: EquipementService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {
    config.placement = 'bottom-right';
    config.autoClose = true;
  }

  ngOnInit(): void {
    this.loadUser();
    this.loadNotifications();
  }

  // METHODES ORIGINALES (conservées inchangées)
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/auth';
  }

  getRoleName(role?: Role): string {
    if (!role) return 'Non défini';
    return {
      [Role.ADMIN]: 'Administrateur',
      [Role.TECHNICIEN_MAINTENANCE]: 'Technicien Maintenance',
      [Role.CHEF_SERVICE_MAINTENANCE]: 'Chef Service Maintenance',
      [Role.CHEF_SERVICE_HOSPITALIER]: 'Chef Service Hospitalier',
      [Role.CHEF_SERVICE_MAGASIN]: 'Chef Service Magasin'
    }[role] || role;
  }

  openChangePasswordModal() {
    this.modalService.open(this.changePasswordModal, { centered: true });
  }

  submitPasswordChange() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    if (!this.user?.id) {
      alert("Utilisateur non connecté.");
      return;
    }

    this.authService.changePassword(this.user.id, this.oldPassword, this.newPassword).subscribe({
      next: () => {
        alert("Mot de passe changé avec succès.");
        this.modalService.dismissAll();
        this.oldPassword = this.newPassword = this.confirmPassword = '';
      },
      error: (err) => {
        alert(err.error || "Erreur lors du changement de mot de passe.");
      }
    });
  }

  // NOUVELLES METHODES POUR LES NOTIFICATIONS
  private loadUser(): void {
    const userJson = localStorage.getItem('currentUser');
    this.user = userJson ? JSON.parse(userJson) : null;
  }

  private loadNotifications(): void {
    this.equipementService.getDerniersEquipementsEnMaintenance().subscribe({
      next: (equipements: Equipement[]) => {
        this.notifications = equipements.map(e => ({
          message: `Maintenance urgente : ${e.nom}`,
          description: `Type: ${e.type} | Localisation: ${e.localisation}`,
          date: new Date(e.dateProchaineMaintenance),
          read: false
        }));
      },
      error: (err) => {
        console.error("Erreur lors du chargement des notifications :", err);
      }
    });
  }

// Méthodes du composant
markAsRead(notification: any, event: Event): void {
  event.stopPropagation();
  notification.read = true;
}

markAllAsRead(event: Event): void {
  event.stopPropagation();
  this.notifications.forEach(n => n.read = true);
}

clearAllNotifications(event: Event): void {
  event.stopPropagation();
  this.notifications = [];
}

hasUnread(): boolean {
  return this.notifications.some(n => !n.read);
}
}


interface Notification {
  message: string;
  description?: string;
  date: Date;
  read: boolean;
}