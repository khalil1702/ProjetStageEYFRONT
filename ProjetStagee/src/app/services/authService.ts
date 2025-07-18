import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Utilisateur } from '../models/Utilisateur';

interface AuthResponse {
  token: string; // Pour récupérer le token JWT si nécessaire (ici Spring renvoie juste un String)
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8089/auth';

  constructor(private http: HttpClient) {}

login(cin: string, password: string): Observable<any> {
  return this.http.post<any>(this.apiUrl + '/login', { cin, password }).pipe(
    tap(response => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user)); // 👈 ICI
    })
  );
}



getAllUsers(): Observable<Utilisateur[]> {
  return this.http.get<Utilisateur[]>('http://localhost:8089/auth/users');
}

  // Méthode d'inscription
  register(user: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl + '/register', user);
  }

  // Pour récupérer le token si besoin dans d'autres composants
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Logout : supprimer token
  logout() {
    localStorage.removeItem('token');
  }

  // Optionnel : méthode pour vérifier si utilisateur est connecté
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
acceptUser(userId: number): Observable<string> {
  return this.http.put(`${this.apiUrl}/accept/${userId}`, null, { responseType: 'text' });
}

rejectUser(userId: number, reason: string): Observable<string> {
  return this.http.put(`${this.apiUrl}/reject/${userId}?reason=${encodeURIComponent(reason)}`, null, { responseType: 'text' });
}

changePassword(userId: number, oldPassword: string, newPassword: string): Observable<string> {
  const body = { oldPassword, newPassword };
  return this.http.post<string>(`${this.apiUrl}/${userId}/change-password`, body, { responseType: 'text' as 'json' });
}

}
