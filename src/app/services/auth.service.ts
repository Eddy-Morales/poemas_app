import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.init();
  }

    private async init() {
    const { data } = await this.supabase.auth.getUser();
    this.userSubject.next(data.user ?? null);

    this.supabase.auth.onAuthStateChange((_event, session) => {
        this.userSubject.next(session?.user ?? null);
    });
    }
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.userSubject.next(data.user ?? null);
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.userSubject.next(null);
  }
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    // user puede ser null si requieres confirmación por email
    this.userSubject.next(data.user ?? null);
    return data;
  }

  get currentUser() {
    return this.userSubject.value;
  }
}