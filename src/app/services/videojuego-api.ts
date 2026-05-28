import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';

export interface Game {
  id: number;
  title: string;
  imageUrl: string;
  platform: string;
  genre: string;
  comment: string;
}

interface FreeToGameRaw {
  id: number;
  title: string;
  thumbnail: string;
  platform: string;
  genre: string;
  short_description: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideojuegoApi {
  private readonly API_URL = 'https://www.freetogame.com/api/games';
  private games$?: Observable<Game[]>;

  constructor(private http: HttpClient) {}

  // Obtener lista completa (con cache en memoria durante la sesión)
  getGames(): Observable<Game[]> {
    if (!this.games$) {
      this.games$ = this.http.get<FreeToGameRaw[]>(this.API_URL).pipe(
        map(list => list.map(this.mapToGame)),
        shareReplay(1),
        catchError(err => {
          console.error('Error fetching games', err);
          return of([] as Game[]);
        })
      );
    }
    return this.games$;
  }

  // Buscar por nombre (filtrado cliente, case-insensitive)
  searchByName(name: string): Observable<Game[]> {
    const q = (name || '').trim().toLowerCase();
    if (!q) return this.getGames();

    return this.getGames().pipe(
      map(list => list.filter(g => g.title.toLowerCase().includes(q)))
    );
  }

  // Opcional: obtener un juego por id (a partir del listado en cache)
  getById(id: number): Observable<Game | undefined> {
    return this.getGames().pipe(map(list => list.find(g => g.id === id)));
  }

  private mapToGame(raw: FreeToGameRaw): Game {
    return {
      id: raw.id,
      title: raw.title,
      imageUrl: raw.thumbnail,
      platform: raw.platform,
      genre: raw.genre,
      comment: raw.short_description,
    };
  }
}