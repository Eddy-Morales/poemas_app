import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
})
export class LoginPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  showWelcome = false;

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    try {
      await this.auth.signIn(this.form.value.email!, this.form.value.password!);

      // Mostrar imagen de bienvenida 2 segundos y luego navegar
      this.showWelcome = true;
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.showWelcome = false;

      await this.router.navigateByUrl('/videojuegos', { replaceUrl: true });
    } catch (e: any) {
      this.error = e?.message ?? 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }

  async openRegister() {
    await this.router.navigate(['/register']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}