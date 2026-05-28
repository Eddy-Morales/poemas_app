import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
})
export class RegisterPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  loading = false;
  error = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  cancel() {
    // navegar de vuelta a login
    this.router.navigate(['/login']);
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    try {
      await this.auth.signUp(this.form.value.email!, this.form.value.password!);
      // después de registrarse, volver al login
      await this.router.navigateByUrl('/login');
    } catch (e: any) {
      this.error = e?.message ?? 'Error al registrar';
    } finally {
      this.loading = false;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}