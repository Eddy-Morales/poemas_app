import { Component, OnInit } from '@angular/core';
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
import { add, locationOutline, gameControllerOutline } from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';
import { FormularioService, RegistroFormulario } from '../../services/formulario.service';

type TarjetaFormulario = RegistroFormulario & {
  imagenPrincipal?: string;
};

@Component({
  selector: 'app-poemas',
  templateUrl: './poemas.page.html',
  styleUrls: ['./poemas.page.scss'],
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
export class PoemasPage implements OnInit {

  poemas: TarjetaFormulario[] = [];

  constructor(
    private authService: AuthService,
    private formularioService: FormularioService,
    private router: Router
  ) {

    addIcons({
      add,
      locationOutline,
      gameControllerOutline
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

    } catch (error) {

      console.error('Error cargando registros del formulario:', error);

    }

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