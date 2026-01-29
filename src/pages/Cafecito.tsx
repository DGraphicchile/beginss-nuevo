import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Users, Sparkles, TrendingUp, Coffee, Search, MapPin, Video, Clock, Plus } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useToast } from '../lib/ToastContext';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import Badge from '../components/Badge';
import WaveDivider from '../components/WaveDivider';
import FloatingElements from '../components/FloatingElements';

interface PostAuthor {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
}

interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  topic: string | null;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  author?: PostAuthor;
}

interface CafecitoEvent {
  id: string;
  title: string;
  description: string;
  type: 'virtual' | 'presencial';
  event_date: string;
  event_time: string;
  location?: string | null;
  host_name: string;
  host_avatar_url: string | null;
  host_bio: string | null;
  participants_count: number;
  max_participants: number;
  image_url: string;
  created_at: string;
}

export default function Cafecito() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<CafecitoEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CafecitoEvent | null>(null);
  const [myRegisteredEventIds, setMyRegisteredEventIds] = useState<Set<string>>(new Set());
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (user) fetchMyRegistrations();
    else setMyRegisteredEventIds(new Set());
  }, [user]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selectedEvent) {
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
  }, [selectedEvent]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('cafecito_posts')
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url, bio)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setPosts((data as Post[]) || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      setEventsError(null);

      const { data, error: fetchError } = await supabase
        .from('cafecito_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (fetchError) throw fetchError;

      setEvents((data as CafecitoEvent[]) || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setEventsError('Error al cargar los eventos');
    } finally {
      setEventsLoading(false);
    }
  };

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
    if (!user || !selectedEvent) return;
    if (myRegisteredEventIds.has(selectedEvent.id)) return;
    if (selectedEvent.participants_count >= selectedEvent.max_participants) return;

    setJoiningEventId(selectedEvent.id);
    try {
      const { error: regError } = await supabase
        .from('cafecito_event_registrations')
        .insert({ event_id: selectedEvent.id, user_id: user.id });

      if (regError) throw regError;

      await supabase.from('user_activities').insert({
        user_id: user.id.toString(),
        activity_type: 'cafecito',
        activity_id: selectedEvent.id,
        title: selectedEvent.title,
        description: selectedEvent.description?.slice(0, 200) || '',
        created_by_me: false,
      });

      await fetchEvents();
      await fetchMyRegistrations();

      setSelectedEvent(prev => prev ? { ...prev, participants_count: prev.participants_count + 1 } : null);
      setMyRegisteredEventIds(prev => new Set([...prev, selectedEvent.id]));
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Error al inscribirse';
      showToast(msg.includes('cupos') ? 'No hay cupos disponibles.' : 'No se pudo completar la inscripción. Intenta de nuevo.', msg.includes('cupos') ? 'warning' : 'error');
    } finally {
      setJoiningEventId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Hace menos de 1h';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Hace 1d';
    return `Hace ${Math.floor(diffInHours / 24)}d`;
  };

  const filters = [
    { id: 'todos', label: 'Todos', icon: Coffee },
    { id: 'bienestar', label: 'Bienestar', icon: Sparkles },
    { id: 'emprendimiento', label: 'Emprendimiento', icon: TrendingUp },
    { id: 'colaboracion', label: 'Colaboración', icon: Users }
  ];

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'todos') return true;
    return post.topic?.toLowerCase() === activeFilter.toLowerCase();
  });

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const virtualEvents = filteredEvents.filter(e => e.type === 'virtual');
  const presencialEvents = filteredEvents.filter(e => e.type === 'presencial');

  const featuredPosts = posts
    .sort((a, b) => (b.likes_count + b.comments_count) - (a.likes_count + a.comments_count))
    .slice(0, 3);

  const CafecitoCard = ({ cafecito }: { cafecito: CafecitoEvent }) => (
    <div
      onClick={() => setSelectedEvent(cafecito)}
      className="bg-white rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={cafecito.image_url}
          alt={cafecito.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 right-4">
          {cafecito.type === 'virtual' ? (
            <Badge variant="celeste" className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              Virtual
            </Badge>
          ) : (
            <Badge variant="pink" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Presencial
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{cafecito.title}</h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {cafecito.description}
        </p>

        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <img
            src={cafecito.host_avatar_url || 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=100'}
            alt={cafecito.host_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#1E1E1E] text-sm">{cafecito.host_name}</p>
            {cafecito.host_bio && <p className="text-xs text-gray-500 truncate">{cafecito.host_bio}</p>}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F5C542]" />
            <span>{new Date(cafecito.event_date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} - {cafecito.event_time.slice(0, 5)}</span>
          </div>
          {cafecito.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#cf3f5c]" />
              <span className="truncate">{cafecito.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2D5444]" />
            <span>{cafecito.participants_count}/{cafecito.max_participants} participantes</span>
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
            src="/grupodemujeresbeginns.jpg"
            alt="Beginss Women Community"
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button variant="cta" className="text-lg px-8 py-4 bg-white text-[#e74865] hover:bg-gray-50 shadow-2xl">
                  Compartir mi historia
                </Button>
              ) : (
                <Button variant="primary" className="text-lg px-8 py-4 bg-white text-[#3E6049] hover:bg-gray-50 shadow-2xl">
                  Únete para participar
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="#FAF7F2" />

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

          {eventsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#e74865] border-t-transparent" />
              <p className="mt-4 text-[#6E6E6E]">Cargando eventos...</p>
            </div>
          ) : eventsError ? (
            <div className="text-center py-12">
              <p className="text-[#e74865] mb-4">{eventsError}</p>
              <Button onClick={fetchEvents}>Intentar de nuevo</Button>
            </div>
          ) : (
            <div className="space-y-16">
              {virtualEvents.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-[#b2d9d9] rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-[#1E1E1E]">Cafecitos Virtuales</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {virtualEvents.map((event) => (
                      <CafecitoCard key={event.id} cafecito={event} />
                    ))}
                  </div>
                </div>
              )}

              {presencialEvents.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-[#cf3f5c] rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-[#1E1E1E]">Cafecitos Presenciales</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {presencialEvents.map((event) => (
                      <CafecitoCard key={event.id} cafecito={event} />
                    ))}
                  </div>
                </div>
              )}

              {filteredEvents.length === 0 && (
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
          )}

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-[#e74865]/10 to-[#b2d9d9]/10 rounded-[2rem] p-12">
              <h3 className="text-3xl font-bold text-[#1E1E1E] mb-4">
                ¿Quieres organizar tu propio Cafecito?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Crea un espacio para conectar con otras mujeres de la comunidad
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="cta" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Crear Cafecito Virtual
                </Button>
                <Button variant="primary" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Crear Cafecito Presencial
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#e74865] border-t-transparent" />
            <p className="mt-4 text-[#6E6E6E]">Cargando publicaciones...</p>
          </div>
        </section>
      ) : error ? (
        <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="text-[#e74865] mb-4">{error}</p>
            <Button onClick={fetchPosts}>Intentar de nuevo</Button>
          </div>
        </section>
      ) : posts.length === 0 ? (
        <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto text-center py-20">
            <Coffee className="w-16 h-16 mx-auto mb-6 text-[#e74865]" />
            <h2 className="text-3xl font-bold text-[#3E6049] mb-4">
              Sé la primera en compartir
            </h2>
            <p className="text-[#6E6E6E] mb-8 max-w-2xl mx-auto">
              La comunidad está esperando tu historia. Comparte tus experiencias, preguntas o conocimientos con otras mujeres Beginss.
            </p>
            {user ? (
              <Button variant="cta">Crear mi primera publicación</Button>
            ) : (
              <Link to="/login">
                <Button variant="cta">Iniciar sesión para participar</Button>
              </Link>
            )}
          </div>
        </section>
      ) : (
        <>
          {featuredPosts.length > 0 && (
            <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#e74865] to-[#f76e89] rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#3E6049]">Destacadas de la semana</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {featuredPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/cafecito/${post.id}`}
                      className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.author?.avatar_url || 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200'}
                          alt={post.author?.full_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {post.topic && (
                          <Badge variant="pink" className="absolute top-4 right-4">
                            {post.topic}
                          </Badge>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e74865]">
                            <img
                              src={post.author?.avatar_url || 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200'}
                              alt={post.author?.full_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-[#3E6049] text-sm">{post.author?.full_name}</p>
                            {post.author?.bio && (
                              <p className="text-xs text-[#8E8E8E] line-clamp-1">{post.author.bio}</p>
                            )}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-[#3E6049] mb-2 group-hover:text-[#e74865] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-[#5F5F5F] mb-4 line-clamp-2 text-sm leading-relaxed">
                          {post.content}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-[#8E8E8E]">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments_count}</span>
                            </div>
                          </div>
                          <span className="text-xs text-[#8E8E8E]">{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {!loading && !error && posts.length > 0 && (
        <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#CDE6E0]/20 to-[#FAF7F2]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-[#3E6049] text-white shadow-lg'
                      : 'bg-white text-[#5F5F5F] hover:bg-gray-50 shadow-md'
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6E6E6E] mb-4">
                  No hay publicaciones en esta categoría todavía
                </p>
                <Button onClick={() => setActiveFilter('todos')} variant="secondary">
                  Ver todas las publicaciones
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/cafecito/${post.id}`}
                    className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#F8E5C9]">
                        <img
                          src={post.author?.avatar_url || 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200'}
                          alt={post.author?.full_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="font-semibold text-[#3E6049]">{post.author?.full_name}</h3>
                            {post.author?.bio && (
                              <p className="text-sm text-[#8E8E8E] line-clamp-1">{post.author.bio}</p>
                            )}
                          </div>
                          {post.topic && (
                            <Badge variant="celeste" className="text-xs">
                              {post.topic}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <h2 className="font-bold text-[#3E6049] text-lg mb-2 hover:text-[#7CA982] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-[#5F5F5F] mb-4 line-clamp-2 leading-relaxed">{post.content}</p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-[#F8E5C9]/50 text-[#5F5F5F] rounded-full font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6 text-sm text-[#8E8E8E]">
                        <div className="flex items-center gap-1 hover:text-[#e74865] transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="font-medium">{post.likes_count}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-[#7CA982] transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-medium">{post.comments_count}</span>
                        </div>
                      </div>
                      <span className="text-xs text-[#8E8E8E]">{formatDate(post.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section-spacing px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/2.jpg"
            alt="Beginss Community"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <img
            src="/icon-beige.svg"
            alt="Beginss Icon"
            className="w-16 h-16 mx-auto mb-6"
          />
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#b2d9d9' }}>
            ¿Lista para compartir tu historia?
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Cada experiencia inspira, cada conversación conecta. Únete a miles de mujeres que comparten y crecen juntas.
          </p>
          {!user && (
            <Button variant="cta" className="bg-white text-[#e74865] hover:bg-gray-50 text-lg px-8 py-4 shadow-2xl">
              Crear cuenta y participar
            </Button>
          )}
        </div>
      </section>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={selectedEvent.image_url}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-t-[2rem]"
              />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedEvent.host_avatar_url || 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={selectedEvent.host_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-[#1E1E1E]">{selectedEvent.host_name}</h3>
                  {selectedEvent.host_bio && <p className="text-sm text-gray-600">{selectedEvent.host_bio}</p>}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1E1E1E] mb-4">{selectedEvent.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">{selectedEvent.description}</p>

              <div className="space-y-3 mb-6 text-gray-600">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#F5C542]" />
                  <span>{new Date(selectedEvent.event_date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {selectedEvent.event_time.slice(0, 5)}</span>
                </div>
                {selectedEvent.type === 'virtual' ? (
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-[#b2d9d9]" />
                    <span>Encuentro Virtual</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#cf3f5c]" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#2D5444]" />
                  <span>{selectedEvent.participants_count}/{selectedEvent.max_participants} participantes confirmados</span>
                </div>
              </div>

              {(() => {
                const isRegistered = myRegisteredEventIds.has(selectedEvent.id);
                const isFull = selectedEvent.participants_count >= selectedEvent.max_participants;
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
                    {joiningEventId === selectedEvent.id ? 'Inscribiendo...' : label}
                  </Button>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
