import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../theme/shared/shared.module";
import { AuthService } from '../../services/authService'; // adapte le chemin
import { Utilisateur, Role } from '../../models/Utilisateur'; // adapte le chemin
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-back',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-back.html',
  styleUrl: './user-back.scss'
})
export class UserBack implements OnInit {
  users: Utilisateur[] = [];
  paginatedUsers: Utilisateur[] = [];
  page: number = 1;
  pageSize: number = 6;
  totalPages: number = 0;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  currentUser!: Utilisateur | null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const userJson = localStorage.getItem('currentUser');
    this.currentUser = userJson ? JSON.parse(userJson) : null;

    if (this.currentUser?.role !== Role.ADMIN) {
      // Optionnel : redirection ou affichage de message
      this.errorMessage = "Accès refusé. Vous n'avez pas les droits nécessaires.";
      return;
    }

    this.loadUsers();
  }


  loadUsers(): void {
    this.authService.getAllUsers().pipe(
      catchError(err => {
        this.errorMessage = "Erreur lors du chargement des utilisateurs.";
        return of([]);
      })
    ).subscribe((data: Utilisateur[]) => {
      this.users = data;
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
      this.updatePagination();
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.updatePagination();
    }
  }

  updatePagination(): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
  }
  accepterUtilisateur(user: Utilisateur): void {
    this.authService.acceptUser(user.id).subscribe({
      next: (message: string) => {
        user.status = true; // ✅ Mise à jour locale immédiate
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: message,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
        // ❌ this.loadUsers(); -> on ne recharge pas la liste
      },
      error: (err) => {
        let errorMsg = "Erreur lors de l'acceptation de l'utilisateur.";
        if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        }
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMsg,
          confirmButtonText: 'OK'
        });
      }
    });
  }


  rejeterUtilisateur(id: number): void {
    const reason = prompt("Veuillez entrer la raison du refus :");
    if (!reason) return;

    this.authService.rejectUser(id, reason).subscribe({
      next: (message: string) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: message,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
        this.loadUsers();
      },
      error: (err) => {
        let errorMsg = "Erreur lors du rejet de l'utilisateur.";
        if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        }
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMsg,
          confirmButtonText: 'OK'
        });
      }
    });
  }



}
