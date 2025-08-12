import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register-ru.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatError,
    RouterLink,
    MatProgressSpinnerModule,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const userData: RegisterRequest = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.authService.setAuthData(response.token, response.user);
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/chat']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.error || 'Registration failed. Please try again.';
          this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
