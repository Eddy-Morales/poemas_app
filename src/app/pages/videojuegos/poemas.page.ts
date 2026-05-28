import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,

  IonButton,

  IonFab,
  IonFabButton,

  IonGrid,
  IonRow,
  IonCol,

  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,

  IonIcon

} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

import { PoemasService, Poema } from '../../services/poemas';

@Component({
  selector: 'app-poemas',
  templateUrl: './poemas.page.html',
  styleUrls: ['./poemas.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,

    IonButton,

    IonFab,
    IonFabButton,

    IonGrid,
    IonRow,
    IonCol,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,

    IonIcon
  ]
})
export class PoemasPage implements OnInit {

  poemas: Poema[] = [];

  constructor(
    private poemasService: PoemasService,
    private sanitizer: DomSanitizer
  ) {

    addIcons({
      add
    });

  }

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {

    try {

      this.poemas = await this.poemasService.listar();

    } catch (error) {

      console.error('Error cargando poemas:', error);

    }

  }

  async eliminar(id: number) {

    try {

      await this.poemasService.eliminar(id);
      await this.cargar();

    } catch (error) {

      console.error('Error eliminando poema:', error);

    }

  }

  isYouTubeUrl(url?: string): boolean {

    return !!url && /youtu\.be|youtube\.com/.test(url);

  }

  getYouTubeEmbedUrl(url: string): SafeResourceUrl | null {

    const videoId = this.extractYouTubeId(url);

    if (!videoId) return null;

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);

  }

  private extractYouTubeId(url: string): string | null {

    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
    );

    return match ? match[1] : null;

  }

}