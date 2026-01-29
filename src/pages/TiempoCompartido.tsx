import { useState } from 'react';
import { Clock, Users, Heart, Sparkles, Gift } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import FloatingElements from '../components/FloatingElements';

interface TiempoOferta {
  id: string;
  title: string;
  description: string;
  type: 'ofrezco' | 'busco';
  hours: number;
  category: string;
  image: string;
  user: {
    name: string;
    avatar: string;
    tiemposBalance: number;
  };
}

export default function TiempoCompartido() {
  const [selectedOferta, setSelectedOferta] = useState<TiempoOferta | null>(null);

  const ofertas: TiempoOferta[] = [
    {
      id: '1',
      title: 'Clases de Matemáticas',
      description: 'Ofrezco tutorías de matemáticas nivel secundaria y bachillerato. Pedagoga con 10 años de experiencia.',
      type: 'ofrezco',
      hours: 2,
      category: 'Educación',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'María González',
        avatar: 'https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg?auto=compress&cs=tinysrgb&w=100',
        tiemposBalance: 15
      }
    },
    {
      id: '2',
      title: 'Ayuda con Mudanza',
      description: 'Necesito ayuda para empacar y organizar mi mudanza. Tengo camioneta disponible.',
      type: 'busco',
      hours: 4,
      category: 'Hogar',
      image: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Laura Pérez',
        avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100',
        tiemposBalance: 8
      }
    },
    {
      id: '3',
      title: 'Cuidado de Mascotas',
      description: 'Ofrezco cuidar tu mascota durante el día o fines de semana. Amo a los animales.',
      type: 'ofrezco',
      hours: 8,
      category: 'Cuidados',
      image: 'https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Camila Flores',
        avatar: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=100',
        tiemposBalance: 22
      }
    },
    {
      id: '4',
      title: 'Traducción Español-Inglés',
      description: 'Ofrezco servicio de traducción de documentos. Traductora certificada.',
      type: 'ofrezco',
      hours: 3,
      category: 'Profesional',
      image: 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Ana Silva',
        avatar: 'https://images.pexels.com/photos/4587979/pexels-photo-4587979.jpeg?auto=compress&cs=tinysrgb&w=100',
        tiemposBalance: 18
      }
    },
    {
      id: '5',
      title: 'Apoyo con Tecnología',
      description: 'Busco alguien que me ayude a configurar mi computadora y enseñarme a usar software básico.',
      type: 'busco',
      hours: 2,
      category: 'Tecnología',
      image: 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Daniela Ortiz',
        avatar: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=100',
        tiemposBalance: 12
      }
    },
    {
      id: '6',
      title: 'Clases de Cocina Vegana',
      description: 'Enseño a preparar recetas veganas deliciosas y nutritivas. Chef certificada.',
      type: 'ofrezco',
      hours: 3,
      category: 'Cocina',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Valentina Cruz',
        avatar: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=100',
        tiemposBalance: 25
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER / HERO con imagen de fondo y texto blanco */}
      <section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: "url('/hero-intercambiotiempo.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <FloatingElements />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white rounded-full shadow-lg">
              <Clock className="w-4 h-4 text-[#CF3F7A]" />
              <span className="text-[#CF3F7A] text-sm font-bold uppercase tracking-wider">Banco de Tiempo</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Intercambio de Tiempo
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Cada hora vale. Intercambia tu tiempo y ayuda a otras.
            </p>

            <Button
              variant="primary"
              className="text-lg px-10 py-4 bg-[#CF3F7A] hover:bg-[#CF3F7A]/90 text-white shadow-2xl rounded-full"
            >
              Explorar ofertas de tiempo
            </Button>
          </div>
        </div>
      </section>

      {/* ¿Cómo Funciona? */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#2D5444] text-center mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-center text-[#5e3920] mb-12 max-w-2xl mx-auto">
            Un sistema justo donde tu tiempo vale igual que el de las demás
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#2D5444] rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl hover:scale-110 transition-transform">
                <Gift className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D5444] mb-3">Ofrece tu ayuda</h3>
              <p className="text-[#5e3920] leading-relaxed">
                Publica lo que puedes hacer por otras: enseñar, ayudar, cuidar o compartir tus habilidades.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-[#F5C542] rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl hover:scale-110 transition-transform">
                <Users className="w-12 h-12 text-[#1E1E1E]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D5444] mb-3">Recibe apoyo</h3>
              <p className="text-[#5e3920] leading-relaxed">
                Encuentra mujeres que ofrecen lo que necesitas. Cada hora intercambiada suma tiempos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-[#CF3F7A] rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl hover:scale-110 transition-transform">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D5444] mb-3">Suma tiempos</h3>
              <p className="text-[#5e3920] leading-relaxed">
                Por cada hora que das, recibes un tiempo Beginss para usar cuando lo necesites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de ofertas */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7EFE9] relative overflow-hidden">
        <Sparkles className="absolute top-20 right-20 w-6 h-6 text-[#F5C542]/50" />
        <Heart className="absolute bottom-40 left-20 w-6 h-6 text-[#CF3F7A]/50" />

        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#2D5444] text-center mb-12">
            Ofertas de Tiempo Disponibles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ofertas.map((oferta) => (
              <div
                key={oferta.id}
                className="bg-[#f6ecdc] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedOferta(oferta)}
              >
                <div className="relative h-48">
                  <img
                    src={oferta.image}
                    alt={oferta.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant={oferta.type === 'ofrezco' ? 'green' : 'yellow'}
                      className={oferta.type === 'ofrezco' ? 'bg-[#2D5444] text-white' : 'bg-[#F5C542] text-[#5e3920]'}
                    >
                      {oferta.type === 'ofrezco' ? 'Ofrezco' : 'Busco'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="pink" className="bg-[#CF3F7A] text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {oferta.hours}h
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <Badge variant="celeste" className="bg-[#b2d9d9] text-[#2D5444] mb-3 text-xs">
                    {oferta.category}
                  </Badge>

                  <h3 className="text-xl font-bold text-[#2D5444] mb-2">{oferta.title}</h3>
                  <p className="text-sm text-[#5e3920] mb-4 line-clamp-3">{oferta.description}</p>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#5e3920]/10 mb-4">
                    <img
                      src={oferta.user.avatar}
                      alt={oferta.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#2D5444] text-sm">{oferta.user.name}</p>
                      <p className="text-xs text-[#F5C542] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {oferta.user.tiemposBalance} tiempos
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full bg-[#2D5444] hover:bg-[#01492b] text-white"
                  >
                    Ver detalle
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER / CTA con imagen de fondo y texto blanco */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/footer-intercambiotiempo.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Clock className="w-16 h-16 mx-auto mb-6 text-[#5e3920]" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Tu tiempo tiene valor
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Colabora, ayuda y recibe. Construyamos juntas una economía del tiempo.
          </p>
          <Button
            variant="cta"
            className="bg-[#F5C542] hover:bg-[#F5C542]/90 text-[#5e3920] text-lg px-10 py-4 shadow-2xl rounded-full"
          >
            Publicar mi oferta de tiempo
          </Button>
        </div>
      </section>

      {/* MODAL detalle */}
      {selectedOferta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedOferta(null)}
        >
          <div
            className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedOferta.image}
                alt={selectedOferta.title}
                className="w-full h-64 object-cover rounded-t-[2rem]"
              />
              <button
                onClick={() => setSelectedOferta(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant={selectedOferta.type === 'ofrezco' ? 'green' : 'yellow'}
                  className={selectedOferta.type === 'ofrezco' ? 'bg-[#2D5444] text-white' : 'bg-[#F5C542] text-[#5e3920]'}
                >
                  {selectedOferta.type === 'ofrezco' ? 'Ofrezco' : 'Busco'}
                </Badge>
                <Badge variant="celeste" className="bg-[#b2d9d9] text-[#2D5444]">
                  {selectedOferta.category}
                </Badge>
                <Badge variant="pink" className="bg-[#CF3F7A] text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedOferta.hours} horas
                </Badge>
              </div>

              <h2 className="text-3xl font-bold text-[#2D5444] mb-4">{selectedOferta.title}</h2>
              <p className="text-lg text-[#5e3920] leading-relaxed mb-6">{selectedOferta.description}</p>

              <div className="bg-[#F7EFE9] rounded-[1.5rem] p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#5e3920] mb-1">Tiempo requerido:</p>
                    <p className="text-2xl font-bold text-[#2D5444] flex items-center gap-2">
                      <Clock className="w-6 h-6 text-[#CF3F7A]" />
                      {selectedOferta.hours} {selectedOferta.hours === 1 ? 'hora' : 'horas'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#5e3920] mb-1">Valor en tiempos:</p>
                    <p className="text-2xl font-bold text-[#F5C542]">{selectedOferta.hours} tiempos</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <img
                  src={selectedOferta.user.avatar}
                  alt={selectedOferta.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-[#2D5444]">{selectedOferta.user.name}</h3>
                  <p className="text-sm text-[#F5C542] flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedOferta.user.tiemposBalance} tiempos disponibles
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full text-lg py-4 bg-[#2D5444] hover:bg-[#01492b] text-white"
              >
                Intercambiar Tiempo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
