import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured, Profile } from './supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  /** true cuando el usuario llegó desde el enlace de recuperación de contraseña */
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
  resetPasswordForEmail: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    // Verificar sesión existente de Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string, skipLoading = false) => {
    try {
      if (!skipLoading) {
        setLoading(true);
      }
      
      // Solo seleccionar campos esenciales para carga rápida inicial
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, bio, location, phone_number, profession, interests, skills, profile_type, beginss_points, onboarding_completed, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        // Si no existe el perfil pero el usuario sí, crear uno básico
        if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
          console.log('Profile not found, creating basic profile...');
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: 'Usuario Beginss',
              interests: [],
              skills: [],
              profile_type: 'both',
              beginss_points: 100,
            });
          
          if (!createError) {
            // Recargar después de crear con campos esenciales
            const { data: newData } = await supabase
              .from('profiles')
              .select('id, full_name, email, avatar_url, bio, location, phone_number, profession, interests, skills, profile_type, beginss_points, onboarding_completed, created_at, updated_at')
              .eq('id', userId)
              .maybeSingle();
            setProfile(newData);
          }
        }
        if (!skipLoading) {
          setLoading(false);
        }
        return;
      }
      setProfile(data);
      if (!skipLoading) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (!skipLoading) {
        setLoading(false);
      }
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabaseConfigured) {
      return { error: new Error('Supabase no está configurado. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env') };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error };

      // Si Supabase no devolvió error pero el usuario ya existía (identities vacío), no crear cuenta
      const identities = (data?.user as { identities?: unknown[] } | undefined)?.identities;
      if (data?.user && Array.isArray(identities) && identities.length === 0) {
        return { error: { message: 'User already registered' } };
      }

      if (data.user) {
        // Intentar insertar el perfil, si ya existe (409) hacer upsert
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            interests: [],
            skills: [],
            profile_type: 'both',
            beginss_points: 100,
          });

        // Si el error es 409 (conflicto - perfil ya existe), intentar actualizar
        if (profileError) {
          // Código 23505 es unique_violation en PostgreSQL, 409 puede venir de RLS
          const isConflictError = profileError.code === '23505' || 
                                  profileError.code === 'P2002' || 
                                  profileError.status === 409 ||
                                  profileError.message?.includes('duplicate') || 
                                  profileError.message?.includes('already exists');
          
          if (isConflictError) {
            // El perfil ya existe, intentar actualizar solo el nombre si es necesario
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ full_name: fullName })
              .eq('id', data.user.id);
            
            if (updateError) {
              console.warn('Error updating existing profile:', updateError);
              // Continuar de todas formas, el perfil existe
            }
            // Cargar el perfil existente después de actualizar (skip loading porque ya estamos en proceso de registro)
            await loadProfile(data.user.id, true);
          } else {
            // Otro tipo de error, retornarlo
            return { error: profileError };
          }
        } else {
          // Cargar el perfil después de crearlo (skip loading porque ya estamos en proceso de registro)
          await loadProfile(data.user.id, true);
        }
        // Establecer loading en false después de todo el proceso
        setLoading(false);
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseConfigured) {
      return { error: new Error('Supabase no está configurado. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env') };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        // El perfil se cargará automáticamente a través de onAuthStateChange
        await loadProfile(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    if (supabaseConfigured) {
      await supabase.auth.signOut();
    }
    setProfile(null);
    setUser(null);
    setSession(null);
    setIsPasswordRecovery(false);
  };

  const clearPasswordRecovery = () => {
    setIsPasswordRecovery(false);
  };

  const resetPasswordForEmail = async (email: string) => {
    if (!supabaseConfigured) {
      return { error: new Error('Supabase no está configurado.') };
    }
    try {
      const redirectTo = `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      return { error: error ?? null };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!supabaseConfigured) {
      return { error: new Error('Supabase no está configurado.') };
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error: error ?? null };
    } catch (error) {
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id, true);
  };

  const value = {
    user,
    profile,
    session,
    signUp,
    signIn,
    signOut,
    loading,
    refreshProfile,
    isPasswordRecovery,
    clearPasswordRecovery,
    resetPasswordForEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
