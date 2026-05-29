import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  IonHeader,
  IonButtons,
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

  IonIcon,
  IonChip,
  IonLabel

} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add, locationOutline, gameControllerOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';
import { FormularioService, RegistroFormulario } from '../../services/formulario.service';

type TarjetaFormulario = RegistroFormulario & {
  imagenPrincipal?: string;
};

@Component({
  selector: 'app-videojuegos',
  templateUrl: './videojuegos.page.html',
  styleUrls: ['./videojuegos.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,

    IonHeader,
    IonButtons,
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

    IonIcon,
    IonChip,
    IonLabel
  ]
})
export class VideojuegosPage implements OnInit {

  @ViewChild(IonContent) content?: IonContent;

  readonly registrosPorPagina = 6;

  poemas: TarjetaFormulario[] = [];
  paginaActual = 1;

  imagenLugarVisibleId: number | null = null;

  toggleImagenLugar(id: number) {
    this.imagenLugarVisibleId =
      this.imagenLugarVisibleId === id ? null : id;
  }

  get totalRegistros(): number {
    return this.poemas.length;
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.totalRegistros / this.registrosPorPagina));
  }

  get poemasPaginaActual(): TarjetaFormulario[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.poemas.slice(inicio, inicio + this.registrosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, index) => index + 1);
  }

  constructor(
    private authService: AuthService,
    private formularioService: FormularioService,
    private router: Router
  ) {

    addIcons({
      add,
      locationOutline,
      gameControllerOutline,
      chevronBackOutline,
      chevronForwardOutline
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

      const registros = await this.formularioService.listar();

      this.poemas = registros.map((registro) => ({
        ...registro,
        imagenPrincipal: registro.imagen_juego_url || registro.imagen_lugar_url || 'assets/icon/default-poema.jpg'
      }));
      this.paginaActual = 1;
      this.imagenLugarVisibleId = null;

    } catch (error) {

      console.error('Error cargando registros del formulario:', error);

    }

  }

  async cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas || pagina === this.paginaActual) {
      return;
    }

    this.paginaActual = pagina;
    this.imagenLugarVisibleId = null;
    await this.content?.scrollToTop(250);
  }

  async paginaAnterior() {
    await this.cambiarPagina(this.paginaActual - 1);
  }

  async paginaSiguiente() {
    await this.cambiarPagina(this.paginaActual + 1);
  }

  async logout() {

    try {

      await this.authService.signOut();
      await this.router.navigate(['/login']);

    } catch (error) {

      console.error('Error cerrando sesión:', error);

    }

  }

}