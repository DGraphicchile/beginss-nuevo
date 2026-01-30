import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, MapPin, Heart, Phone } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import FloatingElements from '../components/FloatingElements';
import AuthGateSection from '../components/AuthGateSection';
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

export default function ConexionPropuestas() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const countries = ['', 'Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador', 'Uruguay', 'Paraguay', 'Bolivia', 'Venezuela', 'Costa Rica', 'Panamá', 'Guatemala', 'República Dominicana', 'España', 'Estados Unidos', 'Otro'];
  
  const citiesByCountry: Record<string, string[]> = {
    'Colombia': ['', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Manizales', 'Ibagué', 'Armenia', 'Pasto', 'Villavicencio', 'Valledupar', 'Montería', 'Sincelejo', 'Popayán', 'Tunja', 'Neiva'],
    'México': ['', 'Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Torreón', 'Querétaro', 'San Luis Potosí'],
    'Argentina': ['', 'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán', 'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe'],
    'Chile': ['', 'Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Rancagua', 'Talca', 'Arica'],
    'Perú': ['', 'Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Cusco', 'Huancayo', 'Chimbote'],
    'Ecuador': ['', 'Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala', 'Durán', 'Manta', 'Portoviejo', 'Loja'],
    'Uruguay': ['', 'Montevideo', 'Salto', 'Ciudad de la Costa', 'Paysandú', 'Las Piedras', 'Rivera', 'Maldonado', 'Tacuarembó', 'Melo'],
    'Paraguay': ['', 'Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá', 'Lambaré', 'Fernando de la Mora', 'Limpio', 'Ñemby'],
    'Bolivia': ['', 'La Paz', 'Santa Cruz', 'Cochabamba', 'Sucre', 'Oruro', 'Tarija', 'Potosí', 'Trinidad', 'Cobija'],
    'Venezuela': ['', 'Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana', 'Barcelona', 'Maturín', 'Ciudad Bolívar'],
    'Costa Rica': ['', 'San José', 'Cartago', 'Alajuela', 'Heredia', 'Puntarenas', 'Limón', 'Liberia', 'San Isidro', 'Desamparados'],
    'Panamá': ['', 'Ciudad de Panamá', 'San Miguelito', 'Tocumen', 'David', 'Arraiján', 'Colón', 'Las Cumbres', 'La Chorrera', 'Pacora'],
    'Guatemala': ['', 'Ciudad de Guatemala', 'Mixco', 'Villa Nueva', 'Quetzaltenango', 'Escuintla', 'San Juan Sacatepéquez', 'Villa Canales', 'Petapa', 'Chinautla'],
    'República Dominicana': ['', 'Santo Domingo', 'Santiago', 'La Vega', 'San Cristóbal', 'San Pedro de Macorís', 'Puerto Plata', 'La Romana', 'San Francisco de Macorís', 'Baní'],
    'España': ['', 'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas'],
    'Estados Unidos': ['', 'Nueva York', 'Los Ángeles', 'Chicago', 'Houston', 'Phoenix', 'Filadelfia', 'San Antonio', 'San Diego', 'Dallas'],
    'Otro': ['']
  };

  // Cargar perfiles de usuarios
  useEffect(() => {
    loadUserProfiles();
  }, [selectedCountry, selectedCity, user]);

  const loadUserProfiles = async () => {
    if (!user) {
      setUserProfiles([]);
      setLoading(false);
      return;
    }
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

        // Filtrar por país y ciudad si están seleccionados
        if (selectedCountry || selectedCity) {
          filtered = filtered.filter((profile) => {
            if (!profile.location) return false;
            
            const locationLower = profile.location.toLowerCase();
            const locationParts = locationLower.split(/[\/,]/).map(s => s.trim());
            
            let matchesCountry = true;
            if (selectedCountry) {
              if (selectedCountry === 'Colombia') {
                const colombianCities = ['bogotá', 'medellín', 'cali', 'barranquilla', 'cartagena', 'bucaramanga', 'pereira', 'santa marta', 'manizales', 'ibagué', 'armenia', 'pasto', 'villavicencio', 'valledupar', 'montería', 'sincelejo', 'popayán', 'tunja', 'neiva'];
                matchesCountry = locationParts.some(part => 
                  colombianCities.some(city => part.includes(city)) || 
                  part.includes('colombia')
                );
              } else {
                matchesCountry = locationLower.includes(selectedCountry.toLowerCase());
              }
            }
            
            const matchesCity = !selectedCity || locationParts.some(part => 
              part.includes(selectedCity.toLowerCase())
            );
            
            return matchesCountry && matchesCity;
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

  // Actualizar ciudades cuando cambia el país
  const availableCities = selectedCountry ? (citiesByCountry[selectedCountry] || []) : [];
  
  // Resetear ciudad cuando cambia el país
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity('');
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* HERO con imagen */}
      <section
        className="relative min-h-[50vh] sm:min-h-[55vh] lg:min-h-[60vh] flex items-center pt-28 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: "url('/hero-conexion.jpg')" }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/35" />
        <FloatingElements />

        <div className="max-w-7xl mx-auto relative z-10 text-center text-white w-full">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 sm:px-5 py-2 sm:py-2.5 bg-white rounded-full shadow-md">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D5444]" />
            <span className="text-[#2D5444] text-xs sm:text-sm font-bold uppercase tracking-wider">
              {t('conexionPropuestasPage.hero.badge')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            {t('conexionPropuestasPage.hero.title')}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('conexionPropuestasPage.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F7EFE9]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2D5444] text-center mb-8 sm:mb-12">{t('conexionPropuestasPage.filters.title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5e3920]/50" />
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-[#2D5444]/20 focus:border-[#2D5444] focus:ring-2 focus:ring-[#2D5444]/20 outline-none transition-all shadow-md appearance-none bg-white"
              >
                <option value="">{t('conexionPropuestasPage.filters.selectCountry')}</option>
                {countries.filter(c => c !== '').map((country) => (
                  <option key={country} value={country}>
                    {country === 'Otro' ? t('conexionPropuestasPage.other') : country}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5e3920]/50" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedCountry || availableCities.length === 0}
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-[#2D5444]/20 focus:border-[#2D5444] focus:ring-2 focus:ring-[#2D5444]/20 outline-none transition-all shadow-md appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{t('conexionPropuestasPage.filters.selectCity')}</option>
                {availableCities.filter(c => c !== '').map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* PROPUESTAS */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2D5444] text-center mb-8 sm:mb-12">{t('conexionPropuestasPage.profiles.title')}</h2>

          {!user ? (
            <AuthGateSection titleKey="auth.sectionNames.conexionPropuestas" />
          ) : loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#CF3F7A] border-t-transparent mb-4" />
              <p className="text-[#5e3920]">{t('conexionPropuestasPage.profiles.loading')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                        {t('conexionPropuestasPage.profiles.viewProfile')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProfiles.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-[#2D5444]/30" />
                  <p className="text-[#5e3920] mb-4">{t('conexionPropuestasPage.profiles.noUsers')}</p>
                  <Button onClick={() => { setSelectedCountry(''); setSelectedCity(''); }}>
                    {t('conexionPropuestasPage.profiles.clearFilters')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA FINAL con imagen de fondo (sin borde) */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/footer-conexion.jpg')" }}
      >
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-[#F5C542]" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white/90">
            {t('conexionPropuestasPage.cta.title')}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90">
            {t('conexionPropuestasPage.cta.subtitle')}
          </p>
        </div>
      </section>

    </div>
  );
}
