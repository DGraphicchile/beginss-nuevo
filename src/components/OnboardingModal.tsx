import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import Button from './Button';
import { Camera, Phone, MapPin, Briefcase, User } from 'lucide-react';

export default function OnboardingModal() {
  const { user, profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    avatar_url: '',
    location: '',
    profession: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        avatar_url: profile.avatar_url || '',
        location: profile.location || '',
        profession: profile.profession || '',
      });
    }
  }, [profile?.id]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecciona una imagen (JPG, PNG, GIF o WebP).');
      return;
    }
    setError('');
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${user.id}-onboarding-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        setError(`Error al subir la imagen: ${uploadError.message}`);
        return;
      }

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      if (urlData?.publicUrl) {
        setFormData((prev) => ({ ...prev, avatar_url: urlData.publicUrl }));
      }
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setError('Error al subir la imagen. Intenta de nuevo.');
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const phone = formData.phone_number?.trim();
    const location = formData.location?.trim();
    const profession = formData.profession?.trim();

    if (!phone) {
      setError('El número de teléfono es obligatorio.');
      return;
    }
    if (!location) {
      setError('La dirección o ciudad es obligatoria.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const payload: Record<string, unknown> = {
        full_name: formData.full_name?.trim() || profile?.full_name || 'Usuario Beginss',
        phone_number: phone || null,
        location: location || null,
        profession: profession || null,
        avatar_url: formData.avatar_url || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      };

      let { error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      // Si falla por columna inexistente (migración no ejecutada), guardar sin onboarding_completed
      if (updateError && (updateError.message?.includes('column') || updateError.code === '42703')) {
        const { onboarding_completed: _, ...payloadWithoutOnboarding } = payload;
        const { error: retryError } = await supabase
          .from('profiles')
          .update(payloadWithoutOnboarding)
          .eq('id', user.id);
        updateError = retryError;
      }

      if (updateError) {
        setError(updateError.message || 'Error al guardar. Intenta de nuevo.');
        setSaving(false);
        return;
      }

      await refreshProfile();
    } catch (err) {
      console.error('Error saving onboarding:', err);
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#2D5444] mb-2">
              ¡Completa tu perfil!
            </h2>
            <p className="text-[#5F5F5F]">
              Para poder navegar en Beginss necesitamos algunos datos importantes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-[#E6A5A1]/20 border border-[#E6A5A1] text-[#C2410C] px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-[#2D5444] mb-2">
                <User className="w-4 h-4 inline mr-1" /> Nombre completo
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none"
                placeholder="Tu nombre"
              />
            </div>

            {/* Foto */}
            <div>
              <label className="block text-sm font-semibold text-[#2D5444] mb-2">
                <Camera className="w-4 h-4 inline mr-1" /> Foto de perfil
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {formData.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-[#7CA982]/40"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#7CA982]/20 flex items-center justify-center border-2 border-dashed border-[#7CA982]/40">
                      <Camera className="w-10 h-10 text-[#7CA982]" />
                    </div>
                  )}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-[#7CA982] text-white p-2 rounded-full shadow hover:bg-[#3E6049] transition-colors"
                    title="Subir foto"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-[#6E6E6E]">
                  Haz clic en el ícono para subir tu foto
                </p>
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-[#2D5444] mb-2">
                <Phone className="w-4 h-4 inline mr-1" /> Número de teléfono *
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData((p) => ({ ...p, phone_number: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none"
                placeholder="Ej: +57 300 123 4567"
                required
              />
            </div>

            {/* Dirección / Ciudad */}
            <div>
              <label className="block text-sm font-semibold text-[#2D5444] mb-2">
                <MapPin className="w-4 h-4 inline mr-1" /> Dirección o ciudad *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none"
                placeholder="Ej: Bogotá, Colombia"
                required
              />
            </div>

            {/* Profesión */}
            <div>
              <label className="block text-sm font-semibold text-[#2D5444] mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" /> Profesión u oficio
              </label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData((p) => ({ ...p, profession: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none"
                placeholder="Ej: Diseñadora, Emprendedora"
              />
            </div>

            <Button
              type="submit"
              variant="cta"
              className="w-full py-4 text-lg"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar y continuar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
