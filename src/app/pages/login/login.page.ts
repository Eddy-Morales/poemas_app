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

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    try {
      await this.auth.signIn(this.form.value.email!, this.form.value.password!);
      await this.router.navigateByUrl('/poemas', { replaceUrl: true });
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