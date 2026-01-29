import { Link } from 'react-router-dom';
import { Repeat, Users, Briefcase, Sparkles, Heart, ArrowRight } from 'lucide-react';
import FloatingElements from '../components/FloatingElements';
import { useAuth } from '../lib/AuthContext';

export default function Intercambio() {
  const { user } = useAuth();

  const cards = [
    {
      id: 'conexion',
      link: '/intercambio/conexion-propuestas',
      icon: Users,
      title: 'Conexión y propuestas',
      description: 'Encuentra colaboradoras para proyectos, crea alianzas estratégicas y haz networking significativo.',
      color: '#cf3f5c',
      image: '/conexion-propuestas.jpg'
    },
    {
      id: 'servicios',
      link: '/intercambio/servicios',
      icon: Briefcase,
      title: 'Servicios',
      description: 'Ofrece tus habilidades profesionales o encuentra los servicios que necesitas dentro de la comunidad.',
      color: '#2D5444',
      image: '/servicios-intercambio.jpg'
    }
  ];

  return (
    <div className="min-h-screen">
       <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
  <div className="absolute inset-0">
    <img
      src="/trendy-and-interracial-group-of-girlfriends-lookin-2024-11-15-08-57-27-utc.jpg"
      alt="Beginss Community"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
  </div>

  <FloatingElements />

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
        <Repeat className="w-4 h-4 text-[#F5C542]" />
        <span className="text-[#1E1E1E] text-sm font-bold uppercase tracking-wider">
          Economía Circular
        </span>
      </div>

      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
        Intercambio
      </h1>

      <div className="max-w-4xl mx-auto mb-8">
        <p className="text-2xl md:text-3xl text-white font-semibold mb-6 leading-relaxed drop-shadow-md">
          Aquí, cada intercambio es una oportunidad y cada conexión, un impulso.
        </p>
        <p className="text-xl text-white/90 leading-relaxed drop-shadow-md">
          Conectamos desde la generosidad: damos, recibimos y crecemos juntas.
        </p>
      </div>
    </div>
  </div>
</section>




      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-3 h-3 bg-[#F5C542] rounded-full"></div>
        <div className="absolute bottom-40 left-10 w-2 h-2 bg-[#cf3f5c] rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-4 border-[#2D5444] rounded-full opacity-5"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-[#F5C542]/10 rounded-full blur-3xl" />
              <div className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl border-2 border-[#F5C542]/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#F5C542] rounded-2xl flex items-center justify-center shadow-md">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#1E1E1E]">
                    Intercambia conexiones con sentido
                  </h2>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#cf3f5c] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                      Plataforma de intercambio
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Una plataforma para que mujeres intercambien conocimientos, productos y servicios, conectando con otras de su ciudad o LATAM para crear alianzas y proyectos.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FAFAFA] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
              Explora las formas de intercambio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Elige la modalidad que más se ajuste a lo que buscas o necesitas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cards.map((card) => (
              <Link
                key={card.id}
                to={card.link}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: card.color }}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {card.description}
                  </p>

                  <div className="flex items-center font-semibold group-hover:translate-x-2 transition-transform" style={{ color: card.color }}>
                    <span>Explorar</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#ffffff' }}>
            ¿Lista para comenzar a intercambiar?
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Únete a cientos de mujeres que ya están creando una economía más justa y colaborativa
          </p>
          {!user && (
            <Link to="/registro">
              <button className="px-8 py-4 bg-white text-[#2D5444] rounded-full font-bold text-lg hover:bg-[#F7EFE9] transition-colors shadow-2xl">
                Crear cuenta y empezar
              </button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
