import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface RegistroFormulario {
  id?: number;
  created_at?: string;
  nombre?: string;
  edad?: number | null;
  rol?: string;
  videojuego_fav?: string;
  plataforma?: string;
  genero?: string;
  comentario_juego?: string;
  latitud?: string;
  longitud?: string;
  lugar_aprox?: string;
  imagen_juego_url?: string;
  imagen_lugar_url?: string;
}

@Injectable({ providedIn: 'root' })
export class FormularioService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async crearRegistro(registro: any) {
    const { data, error } = await this.supabase
      .from('examen1')
      .insert(registro)
      .select();
    if (error) throw error;
    return data;
  }

  async listar() {
    const { data, error } = await this.supabase
      .from('examen1')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data as RegistroFormulario[];
  }

  async subirArchivo(bucket: string | undefined, ruta: string, archivo: File) {
    const bucketName = bucket ?? environment.supabaseBucket ?? 'imagenes_form';

    const { error: uploadError } = await this.supabase.storage
        .from(bucketName)
        .upload(ruta, archivo, { upsert: true });

    if (uploadError) {
        if (/bucket/i.test(uploadError.message || '')) {
        throw new Error(`Bucket "${bucketName}" no encontrado en Supabase.`);
        }
        throw uploadError;
    }

    const { data } = this.supabase.storage.from(bucketName).getPublicUrl(ruta);
    return data?.publicUrl ?? '';
}
}