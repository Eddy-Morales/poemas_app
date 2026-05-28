import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

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

  async subirArchivo(bucket: string | undefined, ruta: string, archivo: File) {
    const bucketName = bucket ?? environment.supabaseBucket;

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