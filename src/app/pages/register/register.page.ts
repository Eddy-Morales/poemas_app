import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

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

  constructor(private fb: FormBuilder, private auth: AuthService, private modalCtrl: ModalController) {}

  cancel() {
    this.modalCtrl.dismiss();
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    try {
      await this.auth.signUp(this.form.value.email!, this.form.value.password!);
      await this.modalCtrl.dismiss({ registered: true });
    } catch (e: any) {
      this.error = e?.message ?? 'Error al registrar';
    } finally {
      this.loading = false;
    }
  }
}