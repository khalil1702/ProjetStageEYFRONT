import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Interventionn } from '../models/Interventionn'; // Assure-toi que ce fichier contient bien ton modèle

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private apiUrl = 'http://localhost:8089/auth/api/interventions'; 

  constructor(private http: HttpClient) {}

  addIntervention(userId: number, equipementId: number, intervention: Interventionn): Observable<Interventionn> {
    const url = `${this.apiUrl}/add/${userId}/${equipementId}`;
    return this.http.post<Interventionn>(url, intervention);
  }

  updateIntervention(id: number, intervention: Interventionn): Observable<Interventionn> {
    const url = `${this.apiUrl}/update/${id}`;
    return this.http.put<Interventionn>(url, intervention);
  }

  getAllInterventions(): Observable<Interventionn[]> {
    return this.http.get<Interventionn[]>(this.apiUrl);
  }

  getInterventionById(id: number): Observable<Interventionn> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Interventionn>(url);
  }

  deleteIntervention(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
