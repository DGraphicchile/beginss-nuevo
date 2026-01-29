import { Link } from 'react-router-dom';
import { Briefcase, Heart, Palette, Leaf, TreePine, ShoppingBag, TrendingUp, Sparkles, Infinity, ArrowRight, Users } from 'lucide-react';
import Button from '../components/Button';
import WaveDivider from '../components/WaveDivider';
import FloatingElements from '../components/FloatingElements';
import { useAuth } from '../lib/AuthContext';

export default function Circulos() {
  const { user } = useAuth();
  const circulos = [
    {
      icon: Briefcase,
      title: 'Economía y Trabajo Colaborativo',
      description: 'Emprendimiento, desarrollo profesional y redes de apoyo para crecer económicamente de forma consciente y colaborativa.',
      tags: ['Emprendimiento', 'Networking', 'Mentoría'],
      color: '#2D5444'
    },
    {
      icon: Heart,
      title: 'Bienestar y Armonía Emocional',
      description: 'Espacios para el autocuidado, la salud mental y el bienestar emocional. Meditación, terapia y apoyo entre mujeres.',
      tags: ['Bienestar', 'Meditación', 'Terapia'],
      color: '#cf3f5c'
    },
    {
      icon: Palette,
      title: 'Arte con Sentido',
      description: 'Creatividad que inspira y transforma. Talleres, proyectos artísticos y expresión a través del arte consciente.',
      tags: ['Creatividad', 'Talleres', 'Expresión'],
      color: '#9b7fbd'
    },
    {
      icon: Leaf,
      title: 'Sostenibilidad en Acción',
      description: 'Prácticas sostenibles para el día a día. Reciclaje, zero waste y estilos de vida que cuidan el planeta.',
      tags: ['Zero Waste', 'Eco-friendly', 'DIY'],
      color: '#2D5444'
    },
    {
      icon: TreePine,
      title: 'Medio Ambiente',
      description: 'Acción climática, conservación y proyectos ambientales. Juntas por un planeta más verde y saludable.',
      tags: ['Activismo', 'Conservación', 'Educación'],
      color: '#2D5444'
    },
    {
      icon: ShoppingBag,
      title: 'Consumo con Sentido',
      description: 'Decisiones de compra conscientes. Apoyamos marcas éticas, comercio justo y economía circular.',
      tags: ['Comercio Justo', 'Ético', 'Local'],
      color: '#E2725B'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 h-[600px]">
          <img
            src="/img-header-circulodeaccion.jpg"
            alt="Círculos de Acción Beginss"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>

        <FloatingElements />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
              <Infinity className="w-3 h-3 text-[#2D5444]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D5444]">Círculos de Acción</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
              Descubre tu Círculo<br />de Acción
            </h2>
            <p className="text-xl text-white max-w-4xl mx-auto leading-relaxed mb-4 drop-shadow-md">
              Seis caminos para inspirarte, crecer y transformar tu vida junto a otras mujeres. Desde la economía colaborativa hasta el arte con propósito, el bienestar integral, la sostenibilidad y el consumo consciente.
            </p>
            <p className="text-lg text-white/90 max-w-3xl mx-auto drop-shadow-md">
              Cada círculo es una oportunidad para actuar, aprender y tejer redes que impulsan un futuro más justo y solidario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {circulos.map((circulo, index) => {
              const circuloId = circulo.title.toLowerCase()
                .replace('economía y trabajo colaborativo', 'economia')
                .replace('bienestar y armonía emocional', 'armonia')
                .replace('arte con sentido', 'arte')
                .replace('sostenibilidad en acción', 'sostenibilidad')
                .replace('medio ambiente', 'medio-ambiente')
                .replace('consumo con sentido', 'consumo');

              return (
                <Link
                  key={index}
                  to={`/circulos/${circuloId}`}
                  className="group relative bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden block"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl" style={{ backgroundColor: circulo.color }}></div>

                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md" style={{ backgroundColor: circulo.color }}>
                      <circulo.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4 transition-colors">
                      {circulo.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {circulo.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex flex-wrap gap-2">
                        {circulo.tags.map((item, i) => (
                          <span key={i} className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: `${circulo.color}1A`, color: circulo.color }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" style={{ color: circulo.color }}>
                      <span>Explorar</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="relative">
            <div className="relative bg-[#b2d9d9] rounded-[3rem] p-12 text-center border-2 border-[#b2d9d9] shadow-xl">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-[#cf3f5c] rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-[#E2725B] rounded-2xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-[#9b7fbd] rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] mb-4">
                  Únete hoy y sé parte del cambio
                </h3>
                <p className="text-xl text-[#1E1E1E] mb-8">
                  Que queremos ver en el mundo
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!user && (
                    <Link to="/registro">
                      <Button variant="cta" className="text-lg px-8 py-4">
                        Crear mi perfil ahora
                      </Button>
                    </Link>
                  )}
                  <Link to="/marketplace">
                    <Button variant="secondary" className="text-lg bg-[#1E1E1E] text-white hover:bg-[#000000] border-[#1E1E1E] px-8 py-4">
                      Explorar Marketplace
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
