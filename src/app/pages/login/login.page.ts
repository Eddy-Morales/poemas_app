import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RegisterPage } from '../register/register.page';

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

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalCtrl: ModalController
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
    const modal = await this.modalCtrl.create({
      component: RegisterPage,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.registered) {
      // opcional: navegar o mostrar mensaje
    }
  }
}