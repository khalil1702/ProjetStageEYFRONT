import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/authService'; 
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [
    
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export default class signin {
  cinDigits: string[] = Array(8).fill('');
  password: string = '';

  @ViewChildren('cinInput') cinInputs!: QueryList<ElementRef>;

  constructor(private authService: AuthService, private router: Router) {}

  getFullCin(): string {
    return this.cinDigits.join('');
  }

  onCinInput(index: number, event: any): void {
    const input = event.target;
    const value = input.value.replace(/\D/g, '');

    if (value.length === 1) {
      this.cinDigits[index] = value;
      if (index < 7) this.focusInput(index + 1);
    } else {
      input.value = this.cinDigits[index]; // ne rien changer si plus de 1 chiffre
    }
  }

  onCinKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      if (this.cinDigits[index]) {
        this.cinDigits[index] = '';
      } else if (index > 0) {
        this.focusInput(index - 1);
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      this.focusInput(index - 1);
    }

    if (event.key === 'ArrowRight' && index < 7) {
      this.focusInput(index + 1);
    }
  }

  onCinPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const data = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 8);
    data.split('').forEach((char, i) => {
      if (i < 8) this.cinDigits[i] = char;
    });
    this.focusInput(Math.min(data.length, 7));
  }

  private focusInput(index: number): void {
    setTimeout(() => {
      const input = this.cinInputs.toArray()[index]?.nativeElement;
      if (input) input.focus();
    }, 0);
  }

  onLogin(): void {
    const cin = this.getFullCin();
    if (cin.length !== 8) {
      alert('Veuillez remplir les 8 chiffres du CIN');
      return;
    }

    this.authService.login(cin, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboardd']);
      },
      error: (err) => {
        alert('Échec de la connexion. Veuillez vérifier votre CIN et mot de passe.');
        console.error(err);
      },
    });
  }
}
