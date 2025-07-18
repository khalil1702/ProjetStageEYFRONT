import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipement } from '../models/Equipement';

@Injectable({
  providedIn: 'root'
})
export class EquipementService {
  private apiUrl = 'http://localhost:8089/auth/api/equipements'; 

  constructor(private http: HttpClient) {}

  getAllEquipements(): Observable<Equipement[]> {
    return this.http.get<Equipement[]>(this.apiUrl);
  }

  getEquipementById(id: number): Observable<Equipement> {
    return this.http.get<Equipement>(`${this.apiUrl}/${id}`);
  }

  addEquipement(equipement: Equipement): Observable<Equipement> {
  return this.http.post<Equipement>(`${this.apiUrl}/add`, equipement);
}
updateEquipement(equipement: Equipement): Observable<Equipement> {
  return this.http.put<Equipement>(`${this.apiUrl}/${equipement.id}`, equipement);
}



  deleteEquipement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
