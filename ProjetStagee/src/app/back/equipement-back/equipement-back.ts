import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EquipementService } from 'src/app/services/equipement';
import { InterventionService } from 'src/app/services/InterventionService ';

import { Equipement, Etat } from 'src/app/models/Equipement';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-equipement-back',
  templateUrl: './equipement-back.html',
  styleUrls: ['./equipement-back.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule]
})
export class EquipementBack implements OnInit {
  equipements: Equipement[] = [];
  filteredEquipements: Equipement[] = [];
  form!: FormGroup;
  showModal = false;
  etats = Object.values(Etat);
  currentUserId!: number;
  searchTerm: string = '';
  p: number = 1;
  itemsPerPage: number = 10;
  sortDirection: { [key: string]: 'asc' | 'desc' } = {};
  selectedEquipement: Equipement | null = null;

  // **Nouveau** pour intervention
  interventionForm!: FormGroup;
  showInterventionModal = false;

  constructor(
    private equipementService: EquipementService,
    private interventionService: InterventionService,  // ✅ correct

    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserId = user.id;
    }

    this.loadEquipements();

    this.form = this.fb.group({
      nom: ['', Validators.required],
      etat: ['', Validators.required],
      type: ['', Validators.required],
      localisation: ['', Validators.required],
      categorie: ['', Validators.required],
      fournisseur: ['', Validators.required],
      serviceAffecte: ['', Validators.required],
      dateMiseEnService: ['', Validators.required],
      dateProchaineMaintenance: ['', Validators.required],
      image: ['']
    });

    // Initialisation formulaire intervention
    this.interventionForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      typeIntervention: ['', Validators.required],
    });
  }

  loadEquipements(): void {
    this.equipementService.getAllEquipements().subscribe({
      next: data => {
        this.equipements = data;
        this.filteredEquipements = [...data];
      },
      error: err => console.error('Erreur chargement équipements', err)
    });
  }

  filterEquipements(): void {
    if (!this.searchTerm) {
      this.filteredEquipements = [...this.equipements];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredEquipements = this.equipements.filter(e =>
      e.nom.toLowerCase().includes(term) ||
      e.etat.toString().toLowerCase().includes(term) ||
      e.type.toLowerCase().includes(term) ||
      e.localisation.toLowerCase().includes(term) ||
      e.categorie.toLowerCase().includes(term) ||
      e.fournisseur.toLowerCase().includes(term) ||
      e.serviceAffecte.toLowerCase().includes(term)
    );
  }

  sortTable(column: string): void {
    this.sortDirection[column] = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';

    this.filteredEquipements.sort((a, b) => {
      const aValue = a[column as keyof Equipement];
      const bValue = b[column as keyof Equipement];

      if (aValue < bValue) {
        return this.sortDirection[column] === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection[column] === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  selectEquipement(e: Equipement): void {
    this.selectedEquipement = e;
  }

  getEtatClass(etat: Etat): string {
    switch (etat) {
      case Etat.EN_SERVICE: return 'bg-success';
      case Etat.EN_PANNE: return 'bg-warning';
      case Etat.EN_MAINTENANCE: return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  isMaintenanceDue(date: Date): boolean {
    const today = new Date();
    const maintenanceDate = new Date(date);
    return maintenanceDate < today;
  }

  openModal(): void {
    this.showModal = true;
    this.form.reset();
    this.selectedEquipement = null; // Réinitialiser mode modification
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedEquipement = null; // Nettoyage
  }

  editEquipement(e: Equipement): void {
    this.selectedEquipement = e;
    this.showModal = true;

    this.form.patchValue({
      nom: e.nom,
      etat: e.etat,
      type: e.type,
      localisation: e.localisation,
      categorie: e.categorie,
      fournisseur: e.fournisseur,
      serviceAffecte: e.serviceAffecte,
      dateMiseEnService: e.dateMiseEnService,
      dateProchaineMaintenance: e.dateProchaineMaintenance,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    const formData: Equipement = this.form.value;

    if (this.selectedEquipement) {
      // 🔄 Modification
      formData.id = this.selectedEquipement.id;
      this.equipementService.updateEquipement(formData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Équipement modifié', 'success');
          this.loadEquipements();
          this.closeModal();
        },
        error: err => {
          Swal.fire('Erreur', err.error?.message || 'Erreur modification équipement', 'error');
        }
      });
    } else {
      // ➕ Ajout
      this.equipementService.addEquipement(formData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Équipement ajouté', 'success');
          this.loadEquipements();
          this.closeModal();
        },
        error: err => {
          Swal.fire('Erreur', err.error?.message || 'Erreur ajout équipement', 'error');
        }
      });
    }
  }

  // *** Gestion Intervention ***

  openInterventionModal(): void {
    if (!this.selectedEquipement) {
      Swal.fire('Erreur', 'Veuillez sélectionner un équipement', 'error');
      return;
    }
    this.showInterventionModal = true;
    this.interventionForm.reset();
  }

  closeInterventionModal(): void {
    this.showInterventionModal = false;
  }

  onInterventionSubmit(): void {
    if (this.interventionForm.invalid || !this.selectedEquipement) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs', 'error');
      return;
    }

    const interventionData = this.interventionForm.value;

    this.interventionService.addIntervention(this.currentUserId, this.selectedEquipement.id, interventionData)
      .subscribe({
        next: () => {
          Swal.fire('Succès', 'Intervention ajoutée', 'success');
          this.closeInterventionModal();
        },
        error: (err) => {
          Swal.fire('Erreur', err.error?.message || 'Erreur ajout intervention', 'error');
        }
      });
  }

  getMathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  deleteEquipement(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.equipementService.deleteEquipement(id).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'Équipement supprimé avec succès.', 'success');
            this.loadEquipements();
          },
          error: err => {
            Swal.fire('Erreur', err.error?.message || 'Erreur suppression', 'error');
          }
        });
      }
    });
  }
}
