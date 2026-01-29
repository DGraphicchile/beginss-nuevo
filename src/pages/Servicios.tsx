import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Search, Users, Phone } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import FloatingElements from '../components/FloatingElements';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Profile } from '../lib/supabase';

interface UserProfile {
  id: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  phone_number?: string;
  interests: string[];
  skills: string[];
}

export default function Servicios() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Categorías de profesiones
  const professionCategories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'Educación', label: 'Educación' },
    { value: 'Bienestar', label: 'Bienestar' },
    { value: 'Diseño', label: 'Diseño' },
    { value: 'Hogar', label: 'Hogar' },
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Salud', label: 'Salud' },
    { value: 'Arte', label: 'Arte' },
    { value: 'Consultoría', label: 'Consultoría' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Finanzas', label: 'Finanzas' },
    { value: 'Gastronomía', label: 'Gastronomía' },
    { value: 'Moda', label: 'Moda' },
    { value: 'Fotografía', label: 'Fotografía' },
    { value: 'Escritura', label: 'Escritura' },
    { value: 'Coaching', label: 'Coaching' },
    { value: 'Otro', label: 'Otro' }
  ];

  // Cargar perfiles de usuarios
  useEffect(() => {
    loadUserProfiles();
  }, [searchTerm, selectedCategory, user]);

  const loadUserProfiles = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('id, full_name, bio, avatar_url, location, phone_number, interests, skills')
        .order('created_at', { ascending: false });

      // Excluir el perfil del usuario actual si está logueado
      if (user) {
        query = query.neq('id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading profiles:', error);
        return;
      }

      if (data) {
        let filtered = data as UserProfile[];

        // Filtrar por término de búsqueda
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filtered = filtered.filter((profile) => {
            const nameMatch = profile.full_name.toLowerCase().includes(searchLower);
            const bioMatch = profile.bio?.toLowerCase().includes(searchLower);
            const skillsMatch = profile.skills.some(skill => skill.toLowerCase().includes(searchLower));
            const interestsMatch = profile.interests.some(interest => interest.toLowerCase().includes(searchLower));
            return nameMatch || bioMatch || skillsMatch || interestsMatch;
          });
        }

        // Filtrar por categoría de profesión
        if (selectedCategory) {
          filtered = filtered.filter((profile) => {
            const skillsMatch = profile.skills.some(skill => 
              skill.toLowerCase().includes(selectedCategory.toLowerCase())
            );
            const interestsMatch = profile.interests.some(interest => 
              interest.toLowerCase().includes(selectedCategory.toLowerCase())
            );
            const bioMatch = profile.bio?.toLowerCase().includes(selectedCategory.toLowerCase());
            return skillsMatch || interestsMatch || bioMatch;
          });
        }

        setUserProfiles(filtered);
      }
    } catch (error) {
      console.error('Error loading user profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = userProfiles;

  return (
    <div className="min-h-screen bg-white">
      {/* HERO con imagen */}
      <section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: "url('/hero-servicios.jpg')" }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/35" />
        <FloatingElements />

        <div className="max-w-7xl mx-auto relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white rounded-full shadow-md">
            <Briefcase className="w-4 h-4 text-[#F5C542]" />
            <span className="text-[#F5C542] text-sm font-bold uppercase tracking-wider">
              Servicios
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Servicios Compartidos
          </h1>

          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Ofrece tus habilidades y encuentra apoyo profesional.
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7EFE9]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#2D5444] text-center mb-12">Filtros de Búsqueda</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Buscador por palabras clave */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5e3920]/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, habilidades o intereses..."
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-[#2D5444]/20 focus:border-[#2D5444] focus:ring-2 focus:ring-[#2D5444]/20 outline-none transition-all shadow-md bg-white"
              />
            </div>

            {/* Filtro por categoría de profesión */}
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5e3920]/50" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-[#2D5444]/20 focus:border-[#2D5444] focus:ring-2 focus:ring-[#2D5444]/20 outline-none transition-all shadow-md appearance-none bg-white"
              >
                {professionCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* PERFILES DE USUARIOS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#2D5444] text-center mb-12">Profesionales Disponibles</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#CF3F7A] border-t-transparent mb-4" />
              <p className="text-[#5e3920]">Cargando profesionales...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="bg-[#F7EFE9] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                  >
                    <div className="relative h-64">
                      <img
                        src={profile.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'}
                        alt={profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#2D5444] mb-2">{profile.full_name}</h3>
                      {profile.bio && (
                        <p className="text-sm text-[#5e3920] mb-4 line-clamp-3">{profile.bio}</p>
                      )}

                      {profile.location && (
                        <div className="flex items-center gap-2 mb-2 text-sm text-[#5e3920]">
                          <MapPin className="w-4 h-4 text-[#CF3F7A]" />
                          <span>{profile.location}</span>
                        </div>
                      )}

                      {profile.phone_number && (
                        <div className="flex items-center gap-2 mb-4 text-sm text-[#5e3920]">
                          <Phone className="w-4 h-4 text-[#CF3F7A]" />
                          <a
                            href={`tel:${profile.phone_number}`}
                            className="text-[#2D5444] font-medium hover:underline"
                          >
                            {profile.phone_number}
                          </a>
                        </div>
                      )}

                      {(profile.interests.length > 0 || profile.skills.length > 0) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {[...profile.interests.slice(0, 2), ...profile.skills.slice(0, 1)].map((item, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white rounded-full text-xs text-[#2D5444] font-semibold"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="primary"
                        className="w-full bg-[#CF3F7A] hover:bg-[#CF3F7A]/90 text-white py-2"
                        onClick={() => navigate(`/perfil/${profile.id}`)}
                      >
                        Ver perfil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProfiles.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-[#2D5444]/30" />
                  <p className="text-[#5e3920] mb-4">No se encontraron profesionales con esos filtros</p>
                  <Button onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}>
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA FINAL con imagen de fondo */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/footer-servicios.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Briefcase className="w-16 h-16 mx-auto mb-6 text-[#F5C542]" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Tu conocimiento puede transformar otra vida
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Comparte tus habilidades y fortalece nuestra comunidad
          </p>
        </div>
      </section>
    </div>
  );
}
