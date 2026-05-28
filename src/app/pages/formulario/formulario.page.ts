import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, IonToast } from '@ionic/angular';
import { FormularioService } from '../../services/formulario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: 'formulario.page.html',
  styleUrls: ['formulario.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class FormularioPage {
  form = this.fb.group({
  nombre: ['', Validators.required],
  edad: [null],
  rol: [''],
  videojuego_fav: [''],
  plataforma: [''],
  genero: [''],
  comentario_juego: [''],
  latitud: [''],
  longitud: [''],
  lugar_aprox: [''],
  imagen_juego_file: [null],
  imagen_lugar_file: [null]
});

  loading = false;
  toastMsg = '';

  constructor(
    private fb: FormBuilder,
    private svc: FormularioService,
    private router: Router
  ) {}

  onFileChange(event: Event, controlName: 'imagen_juego_file' | 'imagen_lugar_file') {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;
    this.form.patchValue({ [controlName]: file });
  }

  async tryGetLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.form.patchValue({
          latitud: String(pos.coords.latitude),
          longitud: String(pos.coords.longitude)
        });
      },
      () => {}
    );
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.toastMsg = '';

    try {
      const value: any = { ...this.form.value };

      // Subir archivos si existen
      const bucket = 'imagenes_form'; // REVISAR: usa el bucket correcto de tu proyecto
      if (value.imagen_juego_file) {
        const file: File = value.imagen_juego_file;
        const ruta = `examen1/imagen_juego_${Date.now()}_${file.name}`;
        value.imagen_juego_url = await this.svc.subirArchivo(bucket, ruta, file);
      }
      if (value.imagen_lugar_file) {
        const file: File = value.imagen_lugar_file;
        const ruta = `examen1/imagen_lugar_${Date.now()}_${file.name}`;
        value.imagen_lugar_url = await this.svc.subirArchivo(bucket, ruta, file);
      }

      // Eliminar campos temporales de file antes de insertar
      delete value.imagen_juego_file;
      delete value.imagen_lugar_file;

      // Inserción
      await this.svc.crearRegistro(value);

      this.toastMsg = 'Registro creado correctamente';
      // Opcional: limpiar formulario o navegar
      this.form.reset();
      await this.router.navigateByUrl('/poemas'); // o la ruta que quieras
    } catch (e: any) {
      this.toastMsg = e?.message ?? 'Error al crear registro';
    } finally {
      this.loading = false;
    }
  }
}