import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Users, Video, Clock, Coffee, Plus, X, Upload, Calendar, List } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '../components/Button';
import Badge from '../components/Badge';
import WaveDivider from '../components/WaveDivider';
import FloatingElements from '../components/FloatingElements';
import { useAuth } from '../lib/AuthContext';
import { useToast } from '../lib/ToastContext';
import { supabase } from '../lib/supabase';
import { CATEGORIAS_TITULOS, parseCategoriesFromDescription } from '../constants/circulos';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CafecitoEvent {
  id: string;
  title: string;
  description: string;
  type: 'virtual' | 'presencial';
  date: string;
  time: string;
  location?: string;
  category?: string;
  tags?: string[];
  host: {
    name: string;
    avatar: string;
    bio: string;
  };
  participants: number;
  maxParticipants: number;
  image: string;
}

export default function CafecitoNew() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const editEventId = (location.state as { editEventId?: string } | null)?.editEventId;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCafecito, setSelectedCafecito] = useState<CafecitoEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventType, setEventType] = useState<'presencial' | 'virtual' | null>(null);
  const [cafecitos, setCafecitos] = useState<CafecitoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRegisteredEventIds, setMyRegisteredEventIds] = useState<Set<string>>(new Set());
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);
  const [showMapView, setShowMapView] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [cafecitoCoordinates, setCafecitoCoordinates] = useState<Record<string, [number, number]>>({});
  const [formData, setFormData] = useState({
    categories: [] as string[],
    name: '',
    image: null as File | null,
    imagePreview: '',
    tags: [] as string[],
    tagInput: '',
    date: '',
    time: '',
    address: '',
    eventUrl: '',
    maxAttendees: '',
    description: '',
  });

  // Cargar cafecitos desde la base de datos
  useEffect(() => {
    loadCafecitos();
  }, []);

  // Abrir modal en modo edición si se llegó desde perfil con editEventId
  useEffect(() => {
    if (!editEventId || !user) return;
    (async () => {
      const { data, error } = await supabase.from('cafecito_events').select('*').eq('id', editEventId).single();
      if (error || !data) return;
      const ev = data as any;
      if (ev.host_id && String(ev.host_id) !== String(user.id)) return;
      const cats = parseCategoriesFromDescription(ev.description || '');
      let tags: string[] = [];
      const tagsMatch = (ev.description || '').match(/Etiquetas:\s*([^\n]+)/);
      if (tagsMatch) tags = tagsMatch[1].split(',').map((t: string) => t.trim()).filter(Boolean);
      const cleanDesc = (ev.description || '').replace(/\[Categoría:\s*[^\]]+\]\s*\n?\n?/gi, '').replace(/\n?\n?Etiquetas:\s*[^\n]+/gi, '').trim();
      setFormData({
        categories: cats.length ? cats : [],
        name: ev.title || '',
        image: null,
        imagePreview: ev.image_url || '',
        tags,
        tagInput: '',
        date: ev.event_date || '',
        time: String(ev.event_time || '').slice(0, 5),
        address: ev.type === 'presencial' ? (ev.location || '') : '',
        eventUrl: ev.type === 'virtual' ? (ev.location || '') : '',
        maxAttendees: String(ev.max_participants || ''),
        description: cleanDesc,
      });
      setEventType(ev.type === 'presencial' ? 'presencial' : 'virtual');
      setEditingEventId(editEventId);
      setShowCreateModal(true);
    })();
  }, [editEventId, user]);

  useEffect(() => {
    if (user) fetchMyRegistrations();
    else setMyRegisteredEventIds(new Set());
  }, [user]);

  const fetchMyRegistrations = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('cafecito_event_registrations')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setMyRegisteredEventIds(new Set((data || []).map((r: { event_id: string }) => r.event_id)));
    } catch (err) {
      console.error('Error fetching my registrations:', err);
    }
  };

  const handleJoinCafecito = async () => {
    if (!user || !selectedCafecito) return;
    if (myRegisteredEventIds.has(selectedCafecito.id)) return;
    if (selectedCafecito.participants >= selectedCafecito.maxParticipants) return;

    setJoiningEventId(selectedCafecito.id);
    try {
      const { error: regError } = await supabase
        .from('cafecito_event_registrations')
        .insert({ event_id: selectedCafecito.id, user_id: user.id });

      if (regError) throw regError;

      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: 'cafecito',
        activity_id: selectedCafecito.id,
        title: selectedCafecito.title,
        description: selectedCafecito.description?.slice(0, 200) || '',
      });

      await loadCafecitos();
      await fetchMyRegistrations();

      setSelectedCafecito(prev => prev ? { ...prev, participants: prev.participants + 1 } : null);
      setMyRegisteredEventIds(prev => new Set([...prev, selectedCafecito.id]));
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Error al inscribirse';
      showToast(msg.includes('cupos') ? 'No hay cupos disponibles.' : 'No se pudo completar la inscripción. Intenta de nuevo.', msg.includes('cupos') ? 'warning' : 'error');
    } finally {
      setJoiningEventId(null);
    }
  };

  // Bloquear scroll del body cuando algún modal está abierto
  useEffect(() => {
    const modalOpen = !!selectedCafecito || showCreateModal;
    if (modalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top ? Math.abs(parseInt(document.body.style.top, 10)) : 0;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [selectedCafecito, showCreateModal]);

  // Obtener ubicación del usuario
  useEffect(() => {
    if (showMapView && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Error getting location:', error);
          // Ubicación por defecto: Bogotá, Colombia
          setUserLocation([4.7110, -74.0721]);
        }
      );
    } else if (showMapView) {
      // Ubicación por defecto: Bogotá, Colombia
      setUserLocation([4.7110, -74.0721]);
    }
  }, [showMapView]);

  // Función para obtener coordenadas aproximadas de una dirección
  const getCoordinatesFromLocation = async (location: string): Promise<[number, number] | null> => {
    try {
      // Usar Nominatim (OpenStreetMap) para geocodificar
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ', Colombia')}&limit=1`,
        {
          headers: {
            'User-Agent': 'Beginss App'
          }
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
    }
    // Coordenadas por defecto: Bogotá
    return [4.7110, -74.0721];
  };

  // Geocodificar cafecitos presenciales cuando se muestre el mapa
  useEffect(() => {
    if (showMapView && cafecitos.length > 0) {
      const geocodeCafecitos = async () => {
        const presenciales = cafecitos.filter(c => c.type === 'presencial');
        const coordinates: Record<string, [number, number]> = {};
        for (const cafecito of presenciales) {
          if (cafecito.location && !cafecitoCoordinates[cafecito.id]) {
            const coords = await getCoordinatesFromLocation(cafecito.location);
            if (coords) {
              coordinates[cafecito.id] = coords;
            }
          }
        }
        if (Object.keys(coordinates).length > 0) {
          setCafecitoCoordinates(prev => ({ ...prev, ...coordinates }));
        }
      };
      geocodeCafecitos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMapView, cafecitos]);

  const loadCafecitos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cafecito_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedCafecitos: CafecitoEvent[] = data.map((event: any) => {
          // Extraer categorías de la descripción (pueden ser varias separadas por coma)
          const categoriesParsed = parseCategoriesFromDescription(event.description || '');
          const category = categoriesParsed.length > 0 ? categoriesParsed.join(', ') : undefined;
          let cleanDescription = (event.description || '')
            .replace(/\[Categoría:\s*[^\]]+\]\s*\n?\n?/gi, '')
            .trim();

          // Extraer etiquetas de la descripción si existen
          let tags: string[] | undefined;
          const tagsMatch = cleanDescription.match(/Etiquetas:\s*([^\n]+)/);
          if (tagsMatch) {
            tags = tagsMatch[1].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            // Remover las etiquetas de la descripción
            cleanDescription = cleanDescription.replace(/\n?\n?Etiquetas:\s*[^\n]+/, '').trim();
          }

          const imageUrl = event.image_url || 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600';
          console.log(`Loading cafecito ${event.id}: image_url =`, imageUrl);

          return {
            id: event.id,
            title: event.title,
            description: cleanDescription,
            type: event.type === 'presencial' ? 'presencial' : 'virtual',
            date: event.event_date,
            time: event.event_time,
            location: event.location || undefined,
            category: category,
            tags: tags,
            host: {
              name: event.host_name || 'Usuario Beginss',
              avatar: event.host_avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
              bio: event.host_bio || '',
            },
            participants: event.participants_count || 0,
            maxParticipants: event.max_participants || 0,
            image: imageUrl,
          };
        });
        setCafecitos(formattedCafecitos);
      }
    } catch (error) {
      console.error('Error loading cafecitos:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockCafecitos: CafecitoEvent[] = [
    {
      id: '1',
      title: 'Cafecito: Emprendimiento Femenino',
      description: 'Conversemos sobre los retos y alegrías de emprender siendo mujer. Comparte tu experiencia y aprende de otras.',
      type: 'virtual',
      date: '2025-11-18',
      time: '18:00',
      host: {
        name: 'María González',
        avatar: 'https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Emprendedora y coach de negocios'
      },
      participants: 8,
      maxParticipants: 15,
      image: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '2',
      title: 'Cafecito en el Parque',
      description: 'Encuentro presencial para conocernos y compartir un café al aire libre. Ideal para hacer nuevas amigas.',
      type: 'presencial',
      date: '2025-11-20',
      time: '16:00',
      location: 'Parque El Virrey, Bogotá',
      host: {
        name: 'Laura Pérez',
        avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Amante del café y las buenas conversaciones'
      },
      participants: 6,
      maxParticipants: 10,
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '3',
      title: 'Cafecito: Bienestar y Autocuidado',
      description: 'Hablemos sobre prácticas de autocuidado y bienestar mental. Un espacio seguro para compartir y aprender.',
      type: 'virtual',
      date: '2025-11-22',
      time: '19:00',
      host: {
        name: 'Camila Flores',
        avatar: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Psicóloga y facilitadora de círculos de mujeres'
      },
      participants: 12,
      maxParticipants: 20,
      image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '4',
      title: 'Cafecito Literario',
      description: 'Compartamos nuestras lecturas favoritas y recomendaciones. Para amantes de los libros y las buenas historias.',
      type: 'presencial',
      date: '2025-11-25',
      time: '17:00',
      location: 'Café Literario, Chapinero',
      host: {
        name: 'Daniela Ortiz',
        avatar: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Escritora y promotora de lectura'
      },
      participants: 5,
      maxParticipants: 12,
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '5',
      title: 'Cafecito: Creatividad y Arte',
      description: 'Un espacio para explorar nuestra creatividad juntas. Comparte tus proyectos artísticos y encuentra inspiración.',
      type: 'virtual',
      date: '2025-11-27',
      time: '20:00',
      host: {
        name: 'Ana Silva',
        avatar: 'https://images.pexels.com/photos/4587979/pexels-photo-4587979.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Artista plástica y facilitadora creativa'
      },
      participants: 10,
      maxParticipants: 18,
      image: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '6',
      title: 'Brunch Beginss',
      description: 'Encuentro especial de brunch para conectar, conversar y disfrutar. Trae tu platillo favorito para compartir.',
      type: 'presencial',
      date: '2025-11-30',
      time: '11:00',
      location: 'Zona T, Bogotá',
      host: {
        name: 'Valentina Cruz',
        avatar: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Food blogger y amante de los encuentros'
      },
      participants: 8,
      maxParticipants: 15,
      image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  // Usar cafecitos de la base de datos, o mock si no hay
  const allCafecitos = cafecitos.length > 0 ? cafecitos : mockCafecitos;
  
  const filteredCafecitos = allCafecitos.filter(cafecito =>
    cafecito.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cafecito.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const virtualCafecitos = filteredCafecitos.filter(c => c.type === 'virtual');
  const presencialCafecitos = filteredCafecitos.filter(c => c.type === 'presencial');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#e74865] border-t-transparent mb-4" />
          <p className="text-gray-600">Cargando cafecitos...</p>
        </div>
      </div>
    );
  }

  const handleCreateCafecito = async () => {
    if (!user || !profile || !eventType) {
      showToast('Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    // Validar campos requeridos
    if (formData.categories.length === 0 || !formData.name || !formData.date || !formData.time || !formData.maxAttendees || !formData.description) {
      showToast('Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    if (eventType === 'presencial' && !formData.address) {
      showToast('Por favor, ingresa la dirección del evento.', 'warning');
      return;
    }

    if (eventType === 'virtual' && !formData.eventUrl) {
      showToast('Por favor, ingresa la URL del evento virtual.', 'warning');
      return;
    }

    try {
      let imageUrl = 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600';
      if (editingEventId && formData.imagePreview && !formData.image) imageUrl = formData.imagePreview;
      // Subir imagen si existe
      if (formData.image) {
        try {
          const fileExt = formData.image.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const filePath = `cafecitos/${fileName}`;

          console.log('Uploading image to:', filePath);

          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('images')
            .upload(filePath, formData.image, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            showToast(`Error al subir la imagen: ${uploadError.message}. Se usará una imagen por defecto.`, 'error');
            // Continuar con imagen por defecto si falla la subida
          } else {
            console.log('Image uploaded successfully:', uploadData);
            const { data: urlData } = supabase.storage
              .from('images')
              .getPublicUrl(filePath);
            
            console.log('Public URL data:', urlData);
            
            if (urlData?.publicUrl) {
              imageUrl = urlData.publicUrl;
              console.log('Using uploaded image URL:', imageUrl);
            } else {
              console.warn('No public URL returned, using default image');
            }
          }
        } catch (uploadErr: any) {
          console.error('Exception uploading image:', uploadErr);
          showToast(`Error al procesar la imagen: ${uploadErr?.message || 'Error desconocido'}. Se usará una imagen por defecto.`, 'error');
          // Continuar con imagen por defecto
        }
      } else {
        console.log('No image provided, using default image');
      }

      // Construir descripción completa con información adicional
      let fullDescription = formData.description;
      if (formData.categories.length > 0) {
        fullDescription = `[Categoría: ${formData.categories.join(', ')}]\n\n${fullDescription}`;
      }
      if (formData.tags.length > 0) {
        fullDescription += `\n\nEtiquetas: ${formData.tags.join(', ')}`;
      }

      // Guardar cafecito en la base de datos (crear o actualizar)
      const eventData: any = {
        title: formData.name.trim(),
        description: fullDescription.trim(),
        type: eventType === 'presencial' ? 'presencial' : 'virtual',
        event_date: formData.date,
        event_time: formData.time,
        max_participants: parseInt(formData.maxAttendees),
        image_url: imageUrl,
        host_name: (profile.full_name || 'Usuario Beginss').trim(),
      };
      if (!editingEventId) eventData.participants_count = 0;

      if (eventType === 'presencial' && formData.address.trim()) {
        eventData.location = formData.address.trim();
      } else if (eventType === 'virtual' && formData.eventUrl.trim()) {
        eventData.location = formData.eventUrl.trim();
      }
      if (user?.id) eventData.host_id = user.id;
      if (profile?.avatar_url) eventData.host_avatar_url = profile.avatar_url;
      if (profile?.bio) eventData.host_bio = profile.bio;

      let newEvent: { id: string } | null = null;
      if (editingEventId) {
        const { data: updated, error: updateError } = await supabase
          .from('cafecito_events')
          .update(eventData)
          .eq('id', editingEventId)
          .select()
          .single();
        if (updateError) throw new Error(`Error al actualizar el cafecito: ${updateError.message}`);
        newEvent = updated;
      } else {
        const { data: inserted, error: eventError } = await supabase
          .from('cafecito_events')
          .insert([eventData])
          .select()
          .single();
        if (eventError) throw new Error(`Error al guardar el cafecito: ${eventError.message}`);
        newEvent = inserted;
        try {
          await supabase.from('user_activities').insert([{
            user_id: user.id.toString(),
            activity_type: 'cafecito',
            activity_id: newEvent.id.toString(),
            title: formData.name.trim(),
            description: formData.description.trim(),
            created_by_me: true,
          }]);
        } catch (_) {}
      }

      await loadCafecitos();
      setShowCreateModal(false);
      setEventType(null);
      setEditingEventId(null);
      setFormData({
        categories: [],
        name: '',
        image: null,
        imagePreview: '',
        tags: [],
        tagInput: '',
        date: '',
        time: '',
        address: '',
        eventUrl: '',
        maxAttendees: '',
        description: '',
      });
      showToast(editingEventId ? 'Cafecito actualizado.' : 'Cafecito creado exitosamente!', 'success');
    } catch (error: any) {
      console.error('Error creating cafecito:', error);
      const errorMessage = error?.message || 'Error desconocido al crear el cafecito';
      showToast(`Error al crear el cafecito: ${errorMessage}. Verifica que todos los campos estén completos e intenta de nuevo.`, 'error');
    }
  };

  const CafecitoCard = ({ cafecito }: { cafecito: CafecitoEvent }) => (
    <div
      onClick={() => setSelectedCafecito(cafecito)}
      className="bg-white rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={cafecito.image}
          alt={cafecito.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            console.error('Error loading image:', cafecito.image);
            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 right-4">
          {cafecito.type === 'virtual' ? (
            <Badge variant="celeste" className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              Virtual
            </Badge>
          ) : (
            <span className="inline-block px-3 py-1 rounded-[20px] text-sm font-medium bg-[#e74865] text-white flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Presencial
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{cafecito.title}</h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {cafecito.description}
        </p>

        {cafecito.tags && cafecito.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {cafecito.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 bg-[#F8E5C9]/50 text-[#5F5F5F] rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <img
            src={cafecito.host.avatar}
            alt={cafecito.host.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#1E1E1E] text-sm">{cafecito.host.name}</p>
            <p className="text-xs text-gray-500 truncate">{cafecito.host.bio}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F5C542]" />
            <span>{new Date(cafecito.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} - {cafecito.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2D5444]" />
            <span>{cafecito.participants}/{cafecito.maxParticipants} participantes</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/2.jpg"
            alt="Beginss Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>

        <FloatingElements />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
              <Coffee className="w-4 h-4 text-[#e74865]" />
              <span className="text-[#3E6049] text-sm font-semibold">Comunidad activa</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Zona Cafecito
            </h1>

            <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Del corazón de una Mujer Beginss a otra: pausa, conexión y creación. Un rincón digital donde bajamos el ritmo para subir la inspiración.{' '}
              <span className="font-semibold text-[#b2d9d9]">Todo pensado para inspirarte, acompañarte y tejer juntas una red que impulsa sueños y crea impacto real.</span>
            </p>
          </div>
        </div>
      </section>

      <WaveDivider color="#FAF7F2" />

      {/* Sección de imagen destacada */}
<section className="py-6 px-6 flex justify-center items-center">
  <div className="max-w-5xl w-full rounded-[2rem] overflow-hidden shadow-md">
    <img
      src="recurso-cafecito-1.svg"
      alt="Cafecito Beginss"
      className="w-full h-auto object-cover rounded-[2rem]"
    />
  </div>
</section>



      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
              ¡Un espacio para conectar y disfrutar juntas!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encontrar nuevas amigas y compartir experiencias, hacer planes o simplemente conversar.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscador Cafecito"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-[#e74865] focus:ring-2 focus:ring-[#e74865]/20 outline-none transition-all text-lg"
              />
            </div>
          </div>


          <div className="space-y-16">
            {virtualCafecitos.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-[#b2d9d9] rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#1E1E1E]">Cafecitos Virtuales</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {virtualCafecitos.map((cafecito) => (
                    <CafecitoCard key={cafecito.id} cafecito={cafecito} />
                  ))}
                </div>
              </div>
            )}

            {presencialCafecitos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#cf3f5c] rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-[#1E1E1E]">Cafecitos Presenciales</h3>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setShowMapView(!showMapView)}
                    className="flex items-center gap-2"
                  >
                    {showMapView ? (
                      <>
                        <List className="w-4 h-4" />
                        Ver lista
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" />
                        Ver mapa
                      </>
                    )}
                  </Button>
                </div>
                {showMapView ? (
                  <div className="h-[600px] rounded-2xl overflow-hidden border-2 border-gray-200">
                    {(userLocation || Object.keys(cafecitoCoordinates).length > 0) && (() => {
                      // Calcular el centro del mapa basado en las coordenadas disponibles
                      let mapCenter: [number, number] = userLocation || [4.7110, -74.0721];
                      const availableCoords = presencialCafecitos
                        .map(c => cafecitoCoordinates[c.id])
                        .filter((c): c is [number, number] => c !== undefined);
                      
                      if (availableCoords.length > 0) {
                        const avgLat = availableCoords.reduce((sum, [lat]) => sum + lat, 0) / availableCoords.length;
                        const avgLng = availableCoords.reduce((sum, [, lng]) => sum + lng, 0) / availableCoords.length;
                        mapCenter = userLocation ? userLocation : [avgLat, avgLng];
                      }
                      
                      return (
                        <MapContainer
                          center={mapCenter}
                          zoom={userLocation ? 12 : 11}
                          style={{ height: '100%', width: '100%' }}
                        >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {presencialCafecitos.map((cafecito) => {
                          const coords = cafecitoCoordinates[cafecito.id] || [4.7110, -74.0721];
                          return (
                            <Marker key={cafecito.id} position={coords}>
                              <Popup>
                                <div className="p-2 min-w-[200px]">
                                  <h4 className="font-bold text-sm mb-1">{cafecito.title}</h4>
                                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{cafecito.description.substring(0, 100)}...</p>
                                  {cafecito.location && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                      <MapPin className="w-3 h-3" />
                                      {cafecito.location}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <Users className="w-3 h-3" />
                                    <span>{cafecito.participants}/{cafecito.maxParticipants} participantes</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setSelectedCafecito(cafecito);
                                      setShowMapView(false);
                                    }}
                                    className="mt-2 text-xs text-[#e74865] hover:underline font-semibold"
                                  >
                                    Ver detalles
                                  </button>
                                </div>
                              </Popup>
                            </Marker>
                          );
                        })}
                        {userLocation && (
                          <Marker position={userLocation}>
                            <Popup>
                              <div className="p-2">
                                <p className="text-sm font-semibold">Tu ubicación</p>
                              </div>
                            </Popup>
                          </Marker>
                        )}
                      </MapContainer>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {presencialCafecitos.map((cafecito) => (
                      <CafecitoCard key={cafecito.id} cafecito={cafecito} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {filteredCafecitos.length === 0 && (
              <div className="text-center py-12">
                <Coffee className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
                  No se encontraron cafecitos con ese término de búsqueda
                </p>
                <Button onClick={() => setSearchTerm('')} variant="secondary">
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </div>

          {user && (
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-br from-[#e74865]/10 to-[#b2d9d9]/10 rounded-[2rem] p-12">
                <h3 className="text-3xl font-bold text-[#1E1E1E] mb-4">
                  ¿Quieres organizar tu propio Cafecito?
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Crea un espacio para conectar con otras mujeres de la comunidad
                </p>
                <Button 
                  variant="cta" 
                  className="flex items-center gap-2 mx-auto"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-5 h-5" />
                  Crear Cafecito
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-spacing px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/international-women-s-day-.jpg"
            alt="Beginss Community"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <img
            src="/recurso-5.svg"
            alt="Beginss Icon"
            className="w-16 h-16 mx-auto mb-6"
          />
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#b2d9d9' }}>
            ¿Lista para compartir tu historia?
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Cada experiencia inspira, cada conversación conecta. Únete a miles de mujeres que comparten y crecen juntas.
          </p>
          {user ? (
            <Link to="/circulos">
              <Button variant="cta" className="bg-white text-[#e74865] hover:bg-gray-50 text-lg px-8 py-4 shadow-2xl">
                Únete a la comunidad
              </Button>
            </Link>
          ) : (
            <Link to="/registro">
              <Button variant="cta" className="bg-white text-[#e74865] hover:bg-gray-50 text-lg px-8 py-4 shadow-2xl">
                Únete a la comunidad
              </Button>
            </Link>
          )}
        </div>
      </section>

      {selectedCafecito && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedCafecito(null)}>
          <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={selectedCafecito.image}
                alt={selectedCafecito.title}
                className="w-full h-64 object-cover rounded-t-[2rem]"
              />
              <button
                onClick={() => setSelectedCafecito(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedCafecito.host.avatar}
                  alt={selectedCafecito.host.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-[#1E1E1E]">{selectedCafecito.host.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCafecito.host.bio}</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1E1E1E] mb-4">{selectedCafecito.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">{selectedCafecito.description}</p>

              <div className="space-y-3 mb-6 text-gray-600">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#F5C542]" />
                  <span>{new Date(selectedCafecito.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {selectedCafecito.time}</span>
                </div>
                {selectedCafecito.type === 'virtual' ? (
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-[#b2d9d9]" />
                    <span>Encuentro Virtual</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#cf3f5c]" />
                    <span>{selectedCafecito.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#2D5444]" />
                  <span>{selectedCafecito.participants}/{selectedCafecito.maxParticipants} participantes confirmados</span>
                </div>
              </div>

              {(() => {
                const isRegistered = myRegisteredEventIds.has(selectedCafecito.id);
                const isFull = selectedCafecito.participants >= selectedCafecito.maxParticipants;
                const canJoin = user && !isRegistered && !isFull;
                const label = !user
                  ? 'Inicia sesión para inscribirte'
                  : isRegistered
                    ? 'Ya me inscribí'
                    : isFull
                      ? 'Cupos llenos'
                      : 'Unirme a este Cafecito';
                return (
                  <Button
                    variant="cta"
                    className="w-full text-lg py-4"
                    disabled={!canJoin || !!joiningEventId}
                    onClick={canJoin ? handleJoinCafecito : undefined}
                  >
                    {joiningEventId === selectedCafecito.id ? 'Inscribiendo...' : label}
                  </Button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear Cafecito */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => {
          setShowCreateModal(false);
          setEventType(null);
          setFormData({
            categories: [],
            name: '',
            image: null,
            imagePreview: '',
            tags: [],
            tagInput: '',
            date: '',
            time: '',
            address: '',
            eventUrl: '',
            maxAttendees: '',
            description: '',
          });
        }}>
          <div className="bg-white rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-[2rem] z-10">
              <h2 className="text-2xl font-bold text-[#1E1E1E]">Crear Cafecito</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEventType(null);
                  setFormData({
                    categories: [],
                    name: '',
                    image: null,
                    imagePreview: '',
                    tags: [],
                    tagInput: '',
                    date: '',
                    time: '',
                    address: '',
                    eventUrl: '',
                    maxAttendees: '',
                    description: '',
                  });
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Selección de tipo */}
              {!eventType ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1E1E1E] mb-4">Selecciona el tipo de evento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setEventType('presencial')}
                      className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#cf3f5c] hover:bg-[#cf3f5c]/5 transition-all text-left"
                    >
                      <MapPin className="w-8 h-8 text-[#cf3f5c] mb-3" />
                      <h4 className="text-xl font-bold text-[#1E1E1E] mb-2">Presencial</h4>
                      <p className="text-gray-600">Encuentro en un lugar físico</p>
                    </button>
                    <button
                      onClick={() => setEventType('virtual')}
                      className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#b2d9d9] hover:bg-[#b2d9d9]/5 transition-all text-left"
                    >
                      <Video className="w-8 h-8 text-[#b2d9d9] mb-3" />
                      <h4 className="text-xl font-bold text-[#1E1E1E] mb-2">Virtual</h4>
                      <p className="text-gray-600">Encuentro virtual</p>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setEventType(null)}
                      className="text-[#e74865] hover:text-[#cf3f5c] transition-colors"
                    >
                      ← Cambiar tipo
                    </button>
                    <Badge variant={eventType === 'presencial' ? 'pink' : 'celeste'} className="flex items-center gap-2">
                      {eventType === 'presencial' ? <MapPin className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      {eventType === 'presencial' ? 'Presencial' : 'Online'}
                    </Badge>
                  </div>

                  {/* Categorías (Círculos de acción) - multi-select */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Categorías * (puedes elegir varias)</label>
                    <div className="border-2 border-gray-200 rounded-2xl p-4 focus-within:border-[#e74865] focus-within:ring-2 focus-within:ring-[#e74865]/20 transition-all max-h-48 overflow-y-auto">
                      {CATEGORIAS_TITULOS.map((titulo) => (
                        <label key={titulo} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2">
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(titulo)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, categories: [...formData.categories, titulo] });
                              } else {
                                setFormData({ ...formData, categories: formData.categories.filter((c) => c !== titulo) });
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#e74865] focus:ring-[#e74865]"
                          />
                          <span className="text-sm text-[#1E1E1E]">{titulo}</span>
                        </label>
                      ))}
                    </div>
                    {formData.categories.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Seleccionadas: {formData.categories.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Nombre del Cafecito *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Cafecito de Emprendimiento"
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#e74865] focus:ring-2 focus:ring-[#e74865]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Imagen */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Imagen</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
                      {formData.imagePreview ? (
                        <div className="relative">
                          <img src={formData.imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl mb-4" />
                          <button
                            onClick={() => {
                              setFormData({ ...formData, image: null, imagePreview: '' });
                            }}
                            className="text-sm text-[#e74865] hover:text-[#cf3f5c]"
                          >
                            Cambiar imagen
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-2">Haz clic para subir una imagen</p>
                          <p className="text-sm text-gray-400">PNG, JPG hasta 5MB</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFormData({ ...formData, image: file, imagePreview: URL.createObjectURL(file) });
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Etiquetas */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Etiquetas</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#e74865]/10 text-[#e74865] rounded-full text-sm font-semibold flex items-center gap-2"
                        >
                          {tag}
                          <button
                            onClick={() => {
                              setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== idx) });
                            }}
                            className="hover:text-[#cf3f5c]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.tagInput}
                        onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && formData.tagInput.trim()) {
                            e.preventDefault();
                            setFormData({
                              ...formData,
                              tags: [...formData.tags, formData.tagInput.trim()],
                              tagInput: '',
                            });
                          }
                        }}
                        placeholder="Escribe una etiqueta y presiona Enter"
                        className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#e74865] focus:ring-2 focus:ring-[#e74865]/20 outline-none transition-all"
                      />
                      <Button
                        variant="primary"
                        onClick={() => {
                          if (formData.tagInput.trim()) {
                            setFormData({
                              ...formData,
                              tags: [...formData.tags, formData.tagInput.trim()],
                              tagInput: '',
                            });
                          }
                        }}
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>

                  {/* Fecha y Hora */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Fecha *</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#e74865] focus:ring-2 focus:ring-[#e74865]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Hora *</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#e74865] focus:ring-2 focus:ring-[#e74865]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Dirección o URL según el tipo */}
                  {eventType === 'presencial' ? (
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Dirección *</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Ej: Calle 123, Bogotá"
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#e74865] focus:ring-2 focus:ring-[#e74865]/20 outline-none transition-all"
                      />
                    </div>
                  ) : eventType === 'virtual' ? (
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">URL del evento *</label>
                      <input
                        type="url"
                        value={formData.eventUrl}
                        onChange={(e) => setFormData({ ...formData, eventUrl: e.target.value })}
                        placeholder="https://meet.google.com/..."
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#e74865] focus:ring-2 focus:ring-[#e74865]/20 outline-none transition-all"
                      />
                    </div>
                  ) : null}

                  {/* Máximo de asistentes */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Máximo de asistentes *</label>
                    <input
                      type="number"
                      value={formData.maxAttendees}
                      onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                      placeholder="Ej: 20"
                      min="1"
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#e74865] focus:ring-2 focus:ring-[#e74865]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Descripción *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe tu Cafecito..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#e74865] focus:ring-2 focus:ring-[#e74865]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowCreateModal(false);
                        setEventType(null);
                        setFormData({
                          categories: [],
                          name: '',
                          image: null,
                          imagePreview: '',
                          tags: [],
                          tagInput: '',
                          date: '',
                          time: '',
                          address: '',
                          eventUrl: '',
                          maxAttendees: '',
                          description: '',
                        });
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="cta"
                      onClick={handleCreateCafecito}
                      className="flex-1"
                      disabled={formData.categories.length === 0 || !formData.name || !formData.date || !formData.time || !formData.maxAttendees || !formData.description || (eventType === 'presencial' && !formData.address) || (eventType === 'virtual' && !formData.eventUrl)}
                    >
                      Crear Cafecito
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
