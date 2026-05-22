import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Poema {
  id?: number;
  created_at?: string;
  titulo: string;
  autor: string;
  contenido: string;
  imagen_url?: string;
  video_url?: string;
  audio_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PoemasService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async listar() {
    const { data, error } = await this.supabase
      .from('poemas')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data as Poema[];
  }

  async obtenerPorId(id: number) {
    const { data, error } = await this.supabase
      .from('poemas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Poema;
  }

  async crear(poema: Poema) {
    const { data, error } = await this.supabase
      .from('poemas')
      .insert(poema)
      .select();

    if (error) throw error;
    return data;
  }

  async actualizar(id: number, poema: Poema) {
    const { data, error } = await this.supabase
      .from('poemas')
      .update(poema)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }

  async eliminar(id: number) {
    const { error } = await this.supabase
      .from('poemas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async subirArchivo(bucket: string, ruta: string, archivo: File) {
    const { error: uploadError } = await this.supabase.storage
      .from(bucket)
      .upload(ruta, archivo, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(ruta);

    return data.publicUrl;
  }
}