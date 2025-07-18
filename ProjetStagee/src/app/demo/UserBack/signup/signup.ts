import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Utilisateur, Role } from 'src/app/models/Utilisateur';
import { AuthService } from 'src/app/services/authService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class Signup {
  user: Utilisateur = new Utilisateur();
  roles = Object.values(Role).filter(role => role !== 'ADMIN');
  cinDigits: string[] = Array(8).fill('');

  @ViewChildren('cinInput') cinInputs!: QueryList<ElementRef>;

  constructor(private authService: AuthService, private router: Router) {
    this.user.password = this.generatePassword();
  }

  generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  getFullCin(): string {
    return this.cinDigits.join('');
  }

  getBoxClass(index: number): string {
    const baseClass = 'cin-input-box';
    const filledClass = this.cinDigits[index] ? 'filled' : '';
    return `${baseClass} ${filledClass}`;
  }

  onCinFocus(event: any): void {
    event.target.select();
  }

  onCinInput(index: number, event: any): void {
    const input = event.target;
    const value = input.value;

    const numericValue = value.replace(/\D/g, '');
    if (numericValue !== value) {
      input.value = numericValue;
      this.cinDigits[index] = numericValue;
    }

    if (numericValue && index < 7) {
      this.focusInput(index + 1);
    }

    this.user.cin = this.getFullCin();
  }

  onCinKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.cinDigits[index] && index > 0) {
      this.focusInput(index - 1);
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      this.focusInput(index - 1);
      event.preventDefault();
    }
    if (event.key === 'ArrowRight' && index < 7) {
      this.focusInput(index + 1);
      event.preventDefault();
    }

    if (event.key === 'Tab' && !event.shiftKey && index < 7) {
      this.focusInput(index + 1);
      event.preventDefault();
    }
  }

  onCinPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 8);

    pasteData.split('').forEach((char, i) => {
      if (i < 8) this.cinDigits[i] = char;
    });

    this.user.cin = this.getFullCin();
    this.focusInput(Math.min(pasteData.length, 7));
  }

  private focusInput(index: number): void {
    setTimeout(() => {
      const input = this.cinInputs.toArray()[index]?.nativeElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 10);
  }

  onRegister(): void {
    if (this.getFullCin().length !== 8) {
      this.cinInputs.forEach(input => input.nativeElement.classList.add('error'));
      Swal.fire({
        icon: 'error',
        title: 'CIN incomplet',
        text: 'Veuillez remplir les 8 chiffres du CIN',
        confirmButtonColor: '#d33'
      });
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie',
          text: 'Veuillez attendre l\'activation de votre compte.',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/auth']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error?.message || "Erreur lors de l'inscription",
          confirmButtonColor: '#d33'
        });
      }
    });
  }
  onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    this.user.image = reader.result as string;
  };
  reader.readAsDataURL(file); // Convertit en base64
}

}