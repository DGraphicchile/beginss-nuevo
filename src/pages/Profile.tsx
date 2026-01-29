import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { MapPin, Coins, Edit } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function Profile() {
  const { profile, user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    interests: [] as string[],
    skills: [] as string[],
    profile_type: 'both' as 'offer' | 'seek' | 'both',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        bio: profile.bio || '',
        location: profile.location || '',
        interests: profile.interests || [],
        skills: profile.skills || [],
        profile_type: profile.profile_type,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          interests: formData.interests,
          skills: formData.skills,
          profile_type: formData.profile_type,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      setEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F9F7F4]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#6E6E6E]">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F9F7F4]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-[#7CA982] to-[#E6A5A1]" />

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-6">
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-[#7CA982]/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#7CA982]">
                      {profile.full_name[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#3E6049]">
                    {profile.full_name}
                  </h1>
                  <Button
                    variant="secondary"
                    onClick={() => setEditing(!editing)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {editing ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-[#6E6E6E]">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-[#7CA982]" />
                    <span className="font-semibold text-[#7CA982]">
                      {profile.beginss_points} puntos Beginss
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {editing ? (
              <div className="space-y-6 border-t border-gray-100 pt-6">
                <div>
                  <label className="block text-sm font-medium text-[#3E6049] mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3E6049] mb-2">
                    Biografía
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all resize-none"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3E6049] mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                    placeholder="Ciudad, País"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3E6049] mb-2">
                    Tipo de perfil
                  </label>
                  <select
                    value={formData.profile_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile_type: e.target.value as 'offer' | 'seek' | 'both',
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                  >
                    <option value="both">Ofrezco y busco</option>
                    <option value="offer">Solo ofrezco</option>
                    <option value="seek">Solo busco</option>
                  </select>
                </div>

                <Button variant="primary" onClick={handleSave} className="w-full">
                  Guardar cambios
                </Button>
              </div>
            ) : (
              <div className="space-y-6 border-t border-gray-100 pt-6">
                {profile.bio && (
                  <div>
                    <h2 className="font-semibold text-[#3E6049] mb-2">Sobre mí</h2>
                    <p className="text-[#6E6E6E]">{profile.bio}</p>
                  </div>
                )}

                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-[#3E6049] mb-3">Intereses</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, idx) => (
                        <Badge key={idx} variant="green">
                          #{interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-[#3E6049] mb-3">Habilidades</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <Badge key={idx}>{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="font-semibold text-[#3E6049] mb-2">Tipo de perfil</h2>
                  <Badge variant="green">
                    {profile.profile_type === 'both'
                      ? 'Ofrezco y busco'
                      : profile.profile_type === 'offer'
                      ? 'Solo ofrezco'
                      : 'Solo busco'}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
