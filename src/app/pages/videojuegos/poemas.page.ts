import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton,
  IonFab, IonFabButton
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PoemasService, Poema } from '../../services/poemas';

@Component({
  selector: 'app-poemas',
  templateUrl: './poemas.page.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton,
    IonFab, IonFabButton
  ]
})
export class PoemasPage implements OnInit {
  poemas: Poema[] = [];

  constructor(
    private poemasService: PoemasService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {
    this.poemas = await this.poemasService.listar();
  }

  async eliminar(id: number) {
    await this.poemasService.eliminar(id);
    await this.cargar();
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