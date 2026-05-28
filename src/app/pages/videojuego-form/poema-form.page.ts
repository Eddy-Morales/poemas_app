import { Component, OnInit } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PoemasService, Poema } from '../../services/poemas';

@Component({
  selector: 'app-poema-form',
  templateUrl: './poema-form.page.html',
  styleUrls: ['./poema-form.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,

    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton
  ]
})
export class PoemaFormPage implements OnInit {

  id?: number;

  loading = false;

  imagenFile?: File;
  audioFile?: File;

  poema: Poema = {
    titulo: '',
    autor: '',
    contenido: '',
    imagen_url: '',
    video_url: '',
    audio_url: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private poemasService: PoemasService
  ) {}

  async ngOnInit() {

    try {

      const idParam = this.route.snapshot.paramMap.get('id');

      if (idParam) {

        this.id = Number(idParam);

        const poemaEncontrado =
          await this.poemasService.obtenerPorId(this.id);

        if (poemaEncontrado) {
          this.poema = poemaEncontrado;
        }

      }

    } catch (error) {

      console.error('Error cargando poema:', error);

    }

  }

  async guardar() {

    try {

      this.loading = true;

      const timestamp = Date.now();

      // SUBIR IMAGEN
      if (this.imagenFile) {

        const extension =
          this.imagenFile.name.split('.').pop();

        const ruta =
          `poemas/imagenes/${timestamp}.${extension}`;

        this.poema.imagen_url =
          await this.poemasService.subirArchivo(
            'imagenes',
            ruta,
            this.imagenFile
          );

      }

      // SUBIR AUDIO
      if (this.audioFile) {

        const extension =
          this.audioFile.name.split('.').pop();

        const ruta =
          `poemas/audios/${timestamp}.${extension}`;

        this.poema.audio_url =
          await this.poemasService.subirArchivo(
            'audios',
            ruta,
            this.audioFile
          );

      }

      // GUARDAR
      if (this.id) {

        await this.poemasService.actualizar(
          this.id,
          this.poema
        );

      } else {

        await this.poemasService.crear(this.poema);

      }

      // REDIRECCIONAR
      this.router.navigate(['/poemas']);

    } catch (error) {

      console.error('Error guardando poema:', error);

    } finally {

      this.loading = false;

    }

  }

  onImagenChange(event: Event) {

    const input = event.target as HTMLInputElement;

    this.imagenFile = input.files?.[0];

  }

  onAudioChange(event: Event) {

    const input = event.target as HTMLInputElement;

    this.audioFile = input.files?.[0];

  }

}