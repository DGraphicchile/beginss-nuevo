import { useState } from 'react';
import { Calendar, MapPin, Users, Video, Sparkles, Heart, BookOpen, Palette } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import Badge from '../components/Badge';
import Button from '../components/Button';
import WaveDivider from '../components/WaveDivider';
import FloatingElements from '../components/FloatingElements';

interface EventData {
  id: string;
  title: string;
  description: string;
  category: string;
  eventType: 'online' | 'presencial';
  date: string;
  time: string;
  location?: string;
  maxParticipants: number;
  currentParticipants: number;
  image: string;
  organizer: {
    name: string;
    avatar: string;
  };
  price: number;
  featured?: boolean;
}

export default function Eventos() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('todos');

  const events: EventData[] = [
    {
      id: '1',
      title: 'Taller de Meditación y Mindfulness',
      description: 'Aprende técnicas de meditación y mindfulness para reducir el estrés y encontrar paz interior. Sesión práctica con ejercicios guiados.',
      category: 'Bienestar',
      eventType: 'online',
      date: '2025-10-20',
      time: '18:00',
      maxParticipants: 30,
      currentParticipants: 22,
      image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Camila Flores',
        avatar: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 0,
      featured: true
    },
    {
      id: '2',
      title: 'Círculo de Lectura: Mujeres que Inspiran',
      description: 'Conversatorio sobre el libro "Mujeres que Corren con los Lobos". Comparte tus reflexiones en un espacio de sororidad.',
      category: 'Cultura',
      eventType: 'presencial',
      date: '2025-10-22',
      time: '17:00',
      location: 'Café Literario, Bogotá',
      maxParticipants: 15,
      currentParticipants: 12,
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Daniela Ortiz',
        avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 15000,
      featured: true
    },
    {
      id: '3',
      title: 'Taller de Emprendimiento Sostenible',
      description: 'Descubre cómo crear un negocio rentable y sostenible. Incluye plan de negocios, marketing verde y finanzas.',
      category: 'Emprendimiento',
      eventType: 'online',
      date: '2025-10-25',
      time: '19:00',
      maxParticipants: 50,
      currentParticipants: 38,
      image: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Carolina Ruiz',
        avatar: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 25000,
      featured: true
    },
    {
      id: '4',
      title: 'Yoga al Amanecer en el Parque',
      description: 'Sesión de yoga al aire libre para iniciar el día con energía positiva. Todos los niveles son bienvenidos.',
      category: 'Bienestar',
      eventType: 'presencial',
      date: '2025-10-21',
      time: '06:30',
      location: 'Parque El Virrey, Bogotá',
      maxParticipants: 25,
      currentParticipants: 18,
      image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Laura Pérez',
        avatar: 'https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 0
    },
    {
      id: '5',
      title: 'Workshop de Fotografía para Redes Sociales',
      description: 'Aprende a crear contenido visual atractivo para tu negocio. Incluye iluminación, composición y edición básica.',
      category: 'Emprendimiento',
      eventType: 'online',
      date: '2025-10-23',
      time: '16:00',
      maxParticipants: 40,
      currentParticipants: 31,
      image: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Valentina Cruz',
        avatar: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 30000
    },
    {
      id: '6',
      title: 'Noche de Arte: Pintura Intuitiva',
      description: 'Conecta con tu creatividad en una sesión de pintura libre. Materiales incluidos. Sin experiencia necesaria.',
      category: 'Arte',
      eventType: 'presencial',
      date: '2025-10-26',
      time: '19:30',
      location: 'Estudio Creativo, Medellín',
      maxParticipants: 12,
      currentParticipants: 8,
      image: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Ana Silva',
        avatar: 'https://images.pexels.com/photos/4587979/pexels-photo-4587979.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 35000
    },
    {
      id: '7',
      title: 'Webinar: Nutrición Consciente',
      description: 'Charla sobre alimentación saludable y balanceada. Incluye plan de comidas y recetas prácticas.',
      category: 'Bienestar',
      eventType: 'online',
      date: '2025-10-24',
      time: '20:00',
      maxParticipants: 100,
      currentParticipants: 67,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Gabriela Vega',
        avatar: 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 0
    },
    {
      id: '8',
      title: 'Taller de Macramé: Crea tu Tapiz',
      description: 'Aprende la técnica ancestral del macramé y crea tu propio tapiz decorativo. Materiales incluidos.',
      category: 'Arte',
      eventType: 'presencial',
      date: '2025-10-27',
      time: '14:00',
      location: 'Casa de Artesanías, Cartagena',
      maxParticipants: 10,
      currentParticipants: 7,
      image: 'https://images.pexels.com/photos/4050314/pexels-photo-4050314.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Sofía Mendoza',
        avatar: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 40000
    },
    {
      id: '9',
      title: 'Cine Foro: Documentales sobre Mujeres',
      description: 'Proyección de documental seguido de conversatorio sobre liderazgo femenino y empoderamiento.',
      category: 'Cultura',
      eventType: 'presencial',
      date: '2025-10-28',
      time: '18:00',
      location: 'Cinemateca Distrital, Bogotá',
      maxParticipants: 50,
      currentParticipants: 42,
      image: 'https://images.pexels.com/photos/7234208/pexels-photo-7234208.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Patricia Torres',
        avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 10000
    },
    {
      id: '10',
      title: 'Masterclass: Marketing Digital para Emprendedoras',
      description: 'Estrategias efectivas de marketing digital, redes sociales y construcción de marca personal.',
      category: 'Emprendimiento',
      eventType: 'online',
      date: '2025-10-29',
      time: '17:00',
      maxParticipants: 80,
      currentParticipants: 59,
      image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Renata Díaz',
        avatar: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 35000
    },
    {
      id: '11',
      title: 'Círculo de Sanación con Aromaterapia',
      description: 'Sesión de sanación colectiva utilizando aceites esenciales y técnicas de respiración consciente.',
      category: 'Bienestar',
      eventType: 'presencial',
      date: '2025-10-30',
      time: '16:00',
      location: 'Centro Holístico, Cali',
      maxParticipants: 20,
      currentParticipants: 15,
      image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'Isabella Ramírez',
        avatar: 'https://images.pexels.com/photos/3756168/pexels-photo-3756168.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 20000
    },
    {
      id: '12',
      title: 'Taller de Cerámica: Tazas Personalizadas',
      description: 'Crea tu propia taza de cerámica desde cero. Incluye moldeado, decoración y horneado.',
      category: 'Arte',
      eventType: 'presencial',
      date: '2025-10-31',
      time: '10:00',
      location: 'Taller de Cerámica, Medellín',
      maxParticipants: 8,
      currentParticipants: 6,
      image: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=600',
      organizer: {
        name: 'María González',
        avatar: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      price: 50000
    }
  ];

  const categories = [
    { id: 'todos', label: 'Todos', icon: Calendar },
    { id: 'bienestar', label: 'Bienestar', icon: Heart },
    { id: 'emprendimiento', label: 'Emprendimiento', icon: Sparkles },
    { id: 'arte', label: 'Arte', icon: Palette },
    { id: 'cultura', label: 'Cultura', icon: BookOpen }
  ];

  const featuredEvents = events.filter(e => e.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('es-ES', { month: 'short' }),
      weekday: date.toLocaleDateString('es-ES', { weekday: 'long' })
    };
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/mujeresbeginns-77.jpg"
            alt="Beginss Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>

        <FloatingElements />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
              <Calendar className="w-4 h-4 text-[#CDE6E0]" />
              <span className="text-[#3E6049] text-sm font-semibold">Experiencias únicas</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Comparte tus talentos
            </h1>

            <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Cada acción que realizas en este mercado impulsa talentos, fortalece nuestra red y cuida del planeta.
Publica tus productos, servicios, cursos o talleres,{' '}
              <span className="font-semibold text-[#b2d9d9]">y descubre lo que otras Mujeres Beginns tienen
para ti. </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button variant="primary" className="text-lg px-8 py-4">
                  Crear mi evento
                </Button>
              ) : (
                <Button variant="primary" className="text-lg px-8 py-4">
                  Únete para participar
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            <span className="px-5 py-2.5 bg-[#ff5001] text-white rounded-full text-sm font-semibold shadow-lg transform rotate-[-2deg] hover:rotate-0 transition-transform">
              Compartir
            </span>
            <span className="px-5 py-2.5 bg-[#eaaeec] text-white rounded-full text-sm font-semibold shadow-lg transform rotate-[2deg] hover:rotate-0 transition-transform">
              Experiencia
            </span>
            <span className="px-5 py-2.5 bg-[#f4b60d] text-white rounded-full text-sm font-semibold shadow-lg transform rotate-[-3deg] hover:rotate-0 transition-transform">
              Visibilidad
            </span>
            <span className="px-5 py-2.5 bg-[#cf3f5c] text-white rounded-full text-sm font-semibold shadow-lg transform rotate-[2deg] hover:rotate-0 transition-transform">
              Conexión
            </span>
          </div>
        </div>
      </section>

      <WaveDivider color="#FAF7F2" />

      {featuredEvents.length > 0 && (
        <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#CDE6E0] to-[#7CA982] rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#3E6049]">Destacados esta semana</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => {
                const dateInfo = formatDate(event.date);
                return (
                  <div
                    key={event.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      <div className="absolute top-4 left-4 bg-white rounded-2xl p-3 text-center shadow-lg">
                        <div className="text-2xl font-bold text-[#3E6049]">{dateInfo.day}</div>
                        <div className="text-xs text-[#8E8E8E] uppercase">{dateInfo.month}</div>
                      </div>

                      <Badge
                        variant={event.eventType === 'online' ? 'celeste' : 'green'}
                        className="absolute top-4 right-4"
                      >
                        {event.eventType === 'online' ? (
                          <>
                            <Video className="w-3 h-3 inline mr-1" />
                            Online
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3 h-3 inline mr-1" />
                            Presencial
                          </>
                        )}
                      </Badge>

                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge variant="default">{event.category}</Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#3E6049] mb-2 group-hover:text-[#7CA982] transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-[#5F5F5F] mb-4 line-clamp-2 text-sm leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4 text-sm text-[#8E8E8E]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="capitalize">{dateInfo.weekday}, {event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.currentParticipants} / {event.maxParticipants} inscritas</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-xl font-bold text-[#7CA982]">
                          {formatPrice(event.price)}
                        </p>
                        <Button variant="outlined" className="text-sm px-4 py-2">
                          Inscribirme
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#CDE6E0]/20 to-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeFilter === category.id
                    ? 'bg-[#3E6049] text-white shadow-lg'
                    : 'bg-white text-[#5F5F5F] hover:bg-gray-50 shadow-md'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => {
              const dateInfo = formatDate(event.date);
              return (
                <div
                  key={event.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white rounded-xl p-2 text-center shadow-md">
                      <div className="text-lg font-bold text-[#3E6049]">{dateInfo.day}</div>
                      <div className="text-xs text-[#8E8E8E] uppercase">{dateInfo.month}</div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="pink" className="text-xs">
                        {event.category}
                      </Badge>
                      <Badge
                        variant={event.eventType === 'online' ? 'celeste' : 'green'}
                        className="text-xs"
                      >
                        {event.eventType === 'online' ? 'Online' : 'Presencial'}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-[#3E6049] mb-2 line-clamp-2 text-sm group-hover:text-[#7CA982] transition-colors">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={event.organizer.avatar}
                        alt={event.organizer.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <p className="text-xs text-[#8E8E8E] truncate">{event.organizer.name}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-[#7CA982]">
                        {formatPrice(event.price)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-[#8E8E8E]">
                        <Users className="w-3 h-3" />
                        <span>{event.currentParticipants}/{event.maxParticipants}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-spacing px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/4.jpg"
            alt="Beginss Eventos"
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
            ¿Quieres organizar tu evento?
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Crea talleres, círculos o encuentros para compartir tu conocimiento con la comunidad Beginss.
          </p>
          {user ? (
            <Button variant="cta" className="bg-white text-[#7CA982] hover:bg-gray-50 text-lg px-8 py-4 shadow-2xl">
              Crear mi primer evento
            </Button>
          ) : (
            <Button variant="cta" className="bg-white text-[#7CA982] hover:bg-gray-50 text-lg px-8 py-4 shadow-2xl">
              Crear cuenta y organizar
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
