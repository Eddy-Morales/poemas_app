import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, IonToast } from '@ionic/angular';
import { FormularioService } from '../../services/formulario.service';
import { VideojuegoApi, Game } from '../../services/videojuego-api';
import { PhotoService, UserPhoto } from '../../services/photo';
import { LocationService } from '../../services/location';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  imagen_juego_url: [''],
  imagen_lugar_file: [null],
  imagen_lugar_url: ['']
});

  loading = false;
  toastMsg = '';

  games: Game[] = [];
  selectedGame?: Game;
  step = 1; // 1: personales, 2: videojuego, 3: ubicación

  constructor(
    private fb: FormBuilder,
    private svc: FormularioService,
    private videojuegoApi: VideojuegoApi,
    private router: Router,
    private photoService: PhotoService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    // Desactivar campos que dependen de la selección del juego
    this.form.get('plataforma')?.disable();
    this.form.get('genero')?.disable();
    this.form.get('comentario_juego')?.disable();
  }

  nextStep() {
    if (this.step === 1) {
      if (this.form.get('nombre')?.invalid) {
        this.toastMsg = 'Completa tu nombre antes de continuar.';
        return;
      }
      this.step = 2;
      return;
    }

    if (this.step === 2) {
      // requerir selección de juego o al menos nombre del juego
      if (!this.form.value.videojuego_fav) {
        this.toastMsg = 'Selecciona un videojuego antes de continuar.';
        return;
      }
      // asegurarse de que los campos dependientes estén habilitados
      this.form.get('plataforma')?.enable();
      this.form.get('genero')?.enable();
      this.form.get('comentario_juego')?.enable();
      this.step = 3;
      return;
    }
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  clearSelectedGame() {
    this.selectedGame = undefined;
    this.form.patchValue({
      videojuego_fav: '',
      plataforma: '',
      genero: '',
      comentario_juego: '',
      imagen_juego_url: ''
    });
    this.form.get('plataforma')?.disable();
    this.form.get('genero')?.disable();
    this.form.get('comentario_juego')?.disable();
  }

  onFileChange(event: Event, controlName: 'imagen_lugar_file') {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;
    this.form.patchValue({ [controlName]: file as any });
  }

  onGameSearch(event: any) {
    const q = (event?.detail?.value || '').trim();
    if (!q) {
      this.games = [];
      return;
    }

    this.videojuegoApi.searchByName(q).pipe(
      catchError(err => {
        this.toastMsg = 'No se pudo obtener la lista de juegos (sin conexión o CORS).';
        return of([]);
      })
    ).subscribe(list => {
      this.games = list;
    });
  }

  selectGame(g: Game) {
    this.selectedGame = g;
    this.form.patchValue({
      videojuego_fav: g.title,
      plataforma: g.platform,
      genero: g.genre,
      comentario_juego: g.comment,
      imagen_juego_url: g.imageUrl
    });
    // Habilitar controles para que sus valores se incluyan en submit, pero mantenerlos readonly en UI
    this.form.get('plataforma')?.enable();
    this.form.get('genero')?.enable();
    this.form.get('comentario_juego')?.enable();
    this.games = [];
  }

  goBack() {
    this.router.navigate(['/poemas']);
  }

  async takePhoto() {
    try {
      await this.photoService.addNewToGallery();
      // La foto se añade al inicio del array
      const latest = this.photoService.photos[0];
      if (latest && latest.webviewPath) {
        this.form.patchValue({ imagen_lugar_url: latest.webviewPath });
        this.toastMsg = 'Foto capturada.';
      } else {
        this.toastMsg = 'No se pudo obtener la foto.';
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
      this.toastMsg = 'Error al tomar la foto.';
    }
  }

  async tryGetLocation() {
    try {
      const perms = await this.locationService.ensurePermissions();
      const granted = perms.location === 'granted' || perms.coarseLocation === 'granted';

      if (!granted) {
        this.toastMsg = 'No se concedieron permisos de ubicación.';
        return;
      }

      const position = await this.locationService.getCurrentPosition();
      this.form.patchValue({
        latitud: String(position.coords.latitude),
        longitud: String(position.coords.longitude)
      });
      this.toastMsg = 'Ubicación obtenida correctamente.';
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      this.toastMsg = 'No se pudo obtener la ubicación en el dispositivo.';
    }
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.toastMsg = '';

    try {
      const value: any = { ...this.form.value };

      // Subir archivo de lugar si existe
      const bucket = 'imagenes_form'; // REVISAR: usa el bucket correcto de tu proyecto
      if (value.imagen_lugar_file) {
        const file: File = value.imagen_lugar_file;
        const ruta = `examen1/imagen_lugar_${Date.now()}_${file.name}`;
        value.imagen_lugar_url = await this.svc.subirArchivo(bucket, ruta, file);
      }

      // Si se tomó una foto con PhotoService y hay imagen local (webviewPath),
      // dejamos `imagen_lugar_url` como está (ruta local) para mostrar o almacenar.

      // Eliminar campos temporales de file antes de insertar
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