import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { InterventionService } from 'src/app/services/InterventionService ';
import { Interventionn, TypeIntervention } from 'src/app/models/Interventionn';

@Component({
  selector: 'app-intervention-back',
  standalone: true,
  templateUrl: './intervention-back.html',
  styleUrls: ['./intervention-back.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule]
})
export class InterventionBack implements OnInit {
  interventions: Interventionn[] = [];
  filteredInterventions: Interventionn[] = [];
  editingIntervention: Interventionn | null = null;

  editForm!: FormGroup;
  showEditModal: boolean = false;
  searchTerm: string = '';
  p: number = 1;
  itemsPerPage: number = 10;
  typeOptions = Object.values(TypeIntervention);

  constructor(
    private interventionService: InterventionService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadInterventions();

    this.editForm = this.fb.group({
      description: ['', Validators.required],
      typeIntervention: ['', Validators.required],
      dateIntervention: ['', Validators.required]
    });
  }

  loadInterventions(): void {
    this.interventionService.getAllInterventions().subscribe({
      next: data => {
        this.interventions = data;
        this.filteredInterventions = [...data];
      },
      error: err => console.error('Erreur chargement interventions', err)
    });
  }

  filterInterventions(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredInterventions = this.interventions.filter(i =>
      i.description.toLowerCase().includes(term) ||
      i.typeIntervention.toLowerCase().includes(term) ||
      new Date(i.date).toLocaleDateString().includes(term)
    );
  }

  openEditModal(intervention: Interventionn): void {
    this.editingIntervention = intervention;

    // Conversion correcte pour l'input date
    const dateValue = new Date(intervention.date);
    const localDate = new Date(dateValue.getTime() - dateValue.getTimezoneOffset() * 60000);
    const formattedDate = localDate.toISOString().split('T')[0];

    this.editForm.patchValue({
      description: intervention.description,
      typeIntervention: intervention.typeIntervention,
      dateIntervention: formattedDate
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingIntervention = null;
  }

  onEditSubmit(): void {
    if (this.editForm.invalid || !this.editingIntervention) return;

    const formValue = this.editForm.value;

    // Crée un nouvel objet Date en tenant compte du décalage horaire
    const dateObj = new Date(formValue.dateIntervention);
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    const correctedDate = new Date(dateObj.getTime() + tzOffset);

    const updated: Interventionn = {
      ...this.editingIntervention,
      description: formValue.description,
      typeIntervention: formValue.typeIntervention,
      date: correctedDate
    };

    this.interventionService.updateIntervention(this.editingIntervention.id, updated).subscribe({
      next: () => {
        Swal.fire('Succès', 'Intervention modifiée avec succès', 'success');
        this.loadInterventions();
        this.closeEditModal();
      },
      error: err => {
        console.error('Erreur détaillée:', err);
        Swal.fire('Erreur', 'Erreur lors de la modification', 'error');
      }
    });
  }

  deleteIntervention(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.interventionService.deleteIntervention(id).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'Intervention supprimée avec succès.', 'success');
            this.loadInterventions();
          },
          error: () => Swal.fire('Erreur', 'Erreur lors de la suppression', 'error')
        });
      }
    });
  }

  getMathMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}