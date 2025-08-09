import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbDropdownModule, NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role, Utilisateur } from 'src/app/models/Utilisateur';
import { AuthService } from 'src/app/services/authService';
import { FormsModule, NgForm } from '@angular/forms';
import { EquipementService } from 'src/app/services/equipement';
import { Equipement } from 'src/app/models/Equipement';
import Swal from 'sweetalert2';

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
  editableUser: Utilisateur = new Utilisateur();

  // Anciennes méthodes conservées
  @ViewChild('changePasswordModal') changePasswordModal!: TemplateRef<any>;
  @ViewChild('editProfileModal') editProfileModal!: TemplateRef<any>;
  @ViewChild('editProfileForm') editProfileForm: NgForm;


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
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.editableUser.image = reader.result as string; // Data URL
      };
      reader.readAsDataURL(file);
    }
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

  submitPasswordChange(form: NgForm) {
    if (form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulaire invalide',
        text: 'Merci de remplir correctement tous les champs.'
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Les nouveaux mots de passe ne correspondent pas.'
      });
      return;
    }

    if (!this.user?.id) {
      Swal.fire('Erreur', "Utilisateur non connecté.", 'error');
      return;
    }

    this.authService.changePassword(this.user.id, this.oldPassword, this.newPassword).subscribe({
      next: () => {
        Swal.fire('Succès', "Mot de passe changé avec succès.", 'success');
        this.modalService.dismissAll();
        this.oldPassword = this.newPassword = this.confirmPassword = '';
      },
      error: (err) => {
        Swal.fire('Erreur', err.error || "Erreur lors du changement de mot de passe.", 'error');
      }
    });
  }

  updateProfile() {
    if (!this.editProfileForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulaire invalide',
        text: 'Merci de corriger les erreurs dans le formulaire avant de soumettre.'
      });
      return;
    }

    // Ton code d’update habituel
    if (!this.user) {
      Swal.fire('Erreur', "Utilisateur non connecté.", 'error');
      return;
    }

    this.authService.updateUserProfile(this.user.id, this.editableUser).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        Swal.fire('Succès', "Profil mis à jour avec succès.", 'success');
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Erreur', "Erreur lors de la mise à jour du profil.", 'error');
      }
    });
  }
  openEditProfileModal() {
    if (this.user) {
      this.editableUser = { ...this.user }; // clone pour modification sans impact direct
      this.modalService.open(this.editProfileModal, { centered: true });
    }
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