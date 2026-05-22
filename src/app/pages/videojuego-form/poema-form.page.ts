import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonTextarea, IonButton
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoemasService, Poema } from '../../services/poemas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poema-form',
  templateUrl: './poema-form.page.html', // Cambia el nombre si renombras el archivo HTML
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonTextarea, IonButton
  ]
})
export class PoemaFormPage implements OnInit {

  id?: number;

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
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = Number(idParam);
      this.poema = await this.poemasService.obtenerPorId(this.id);
    }
  }

  async guardar() {
    const timestamp = Date.now();

    if (this.imagenFile) {
      const extension = this.imagenFile.name.split('.').pop();
      const ruta = `poemas/imagenes/${timestamp}.${extension}`;
      this.poema.imagen_url = await this.poemasService.subirArchivo('imagenes', ruta, this.imagenFile);
    }

    if (this.audioFile) {
      const extension = this.audioFile.name.split('.').pop();
      const ruta = `poemas/audios/${timestamp}.${extension}`;
      this.poema.audio_url = await this.poemasService.subirArchivo('audios', ruta, this.audioFile);
    }

    if (this.id) {
      await this.poemasService.actualizar(this.id, this.poema);
    } else {
      await this.poemasService.crear(this.poema);
    }

    this.router.navigate(['/poemas']);
  }

  imagenFile?: File;
  audioFile?: File;

  onImagenChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.imagenFile = input.files?.[0];
  }

  onAudioChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.audioFile = input.files?.[0];
  }
}