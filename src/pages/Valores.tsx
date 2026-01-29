import { Link } from 'react-router-dom';
import { Heart, Users, Infinity, Sparkles, Leaf, Target, Globe, Gift, Lightbulb, TreePine, Handshake, TrendingUp } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import WaveDivider from '../components/WaveDivider';
import FloatingElements from '../components/FloatingElements';

export default function Valores() {
  const valoresActivos = [
    {
      icon: Heart,
      title: 'Bienestar',
      description: 'Cuidamos nuestro equilibrio personal y colectivo para crecer con armonía.',
      color: 'bg-[#E2725B]/10',
      iconColor: 'text-[#E2725B]',
      iconBg: 'bg-[#FFE5E3]'
    },
    {
      icon: TrendingUp,
      title: 'Empoderamiento',
      description: 'Creemos en la fuerza de cada mujer para liderar su propio camino.',
      color: 'bg-[#F5C542]/10',
      iconColor: 'text-[#F5C542]',
      iconBg: 'bg-[#FFF9E6]'
    },
    {
      icon: Gift,
      title: 'Generosidad',
      description: 'Compartimos lo que sabemos y tenemos, multiplicando oportunidades.',
      color: 'bg-[#3B6E58]/10',
      iconColor: 'text-[#3B6E58]',
      iconBg: 'bg-[#E8F5ED]'
    },
    {
      icon: Lightbulb,
      title: 'Innovación',
      description: 'Transformamos ideas en soluciones reales que generan impacto.',
      color: 'bg-[#F5C542]/10',
      iconColor: 'text-[#F5C542]',
      iconBg: 'bg-[#FFF9E6]'
    },
    {
      icon: TreePine,
      title: 'Naturaleza',
      description: 'Vivimos en conexión y respeto con el entorno que nos sostiene.',
      color: 'bg-[#3B6E58]/10',
      iconColor: 'text-[#3B6E58]',
      iconBg: 'bg-[#E8F5ED]'
    },
    {
      icon: Leaf,
      title: 'Sostenibilidad',
      description: 'Construimos hoy pensando en el bienestar de mañana.',
      color: 'bg-[#3B6E58]/10',
      iconColor: 'text-[#3B6E58]',
      iconBg: 'bg-[#E8F5ED]'
    },
    {
      icon: Handshake,
      title: 'Sororidad',
      description: 'Nos apoyamos, nos escuchamos y crecemos juntas.',
      color: 'bg-[#E2725B]/10',
      iconColor: 'text-[#E2725B]',
      iconBg: 'bg-[#FFE5E3]'
    },
    {
      icon: Infinity,
      title: 'Circularidad',
      description: 'Lo que damos regresa transformado, fortaleciendo nuestros lazos.',
      color: 'bg-[#3B6E58]/10',
      iconColor: 'text-[#3B6E58]',
      iconBg: 'bg-[#E8F5ED]'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#E8F5ED] via-[#F7EFE9] to-[#FFFFFF]">
        <FloatingElements />

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3B6E58]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E2725B]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white rounded-full shadow-lg">
              <Infinity className="w-4 h-4 text-[#3B6E58]" />
              <span className="text-[#1E1E1E] text-sm font-semibold">Nuestros valores</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1E1E1E] mb-6 leading-tight">
              Nuestros{' '}
              <span className="text-[#3B6E58]">Valores Activos</span>
            </h1>

            <p className="text-xl text-[#1E1E1E] mb-8 max-w-3xl mx-auto leading-relaxed">
              Ocho valores que guían cada acción, cada intercambio y cada conexión en nuestra comunidad
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-[#E2725B]/10 via-[#3B6E58]/20 to-[#F5C542]/10 rounded-3xl p-8 md:p-12 shadow-2xl mb-16 relative overflow-hidden border-l-4 border-[#3B6E58]">
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
                <Sparkles className="w-64 h-64 text-[#3B6E58]" />
              </div>
              <div className="relative z-10">
                <p className="text-2xl md:text-3xl text-[#1E1E1E] italic leading-relaxed font-semibold text-center">
                  "Lo que compartes, regresa transformado; lo que recibes, se multiplica."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="#F7EFE9" />

      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-[#F7EFE9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
              Valores que nos mueven
            </h2>
            <p className="text-xl text-[#1E1E1E] max-w-2xl mx-auto">
              Cada valor es una guía que nos impulsa a crear impacto real en nuestras vidas y en las de otras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valoresActivos.map((valor, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 text-center relative overflow-hidden"
              >
                <div className={`absolute inset-0 ${valor.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="relative z-10">
                  <div className={`w-20 h-20 ${valor.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <valor.icon className={`w-10 h-10 ${valor.iconColor}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4">
                    {valor.title}
                  </h3>

                  <p className="text-[#1E1E1E] leading-relaxed">
                    {valor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#E8F5ED]/20 to-[#F7EFE9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="green" className="mb-4">Nuestra esencia</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
              El corazón de Beginss
            </h2>
            <p className="text-xl text-[#1E1E1E] max-w-2xl mx-auto">
              Una comunidad que nace desde la autenticidad y crece con cada historia compartida
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Conexión auténtica"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3B6E58]/90 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-[#3B6E58]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Conexión Auténtica
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#1E1E1E] leading-relaxed">
                  Un espacio donde las mujeres se conectan de forma genuina, compartiendo saberes y construyendo relaciones significativas.
                </p>
              </div>
            </div>

            <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Red viva"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#E2725B]/90 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-[#E2725B]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Red en Crecimiento
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#1E1E1E] leading-relaxed">
                  Una comunidad que crece con cada mujer que se suma, con cada intercambio y cada conversación que florece.
                </p>
              </div>
            </div>

            <div className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Aprendizaje mutuo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#E8F5ED]/90 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3">
                    <Heart className="w-6 h-6 text-[#3B6E58]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Maestras y Aprendices
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#1E1E1E] leading-relaxed">
                  Todas somos maestras y aprendices al mismo tiempo, compartiendo conocimientos y creciendo juntas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-[#F7EFE9]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-[#E8F5ED]/30 rounded-full blur-3xl" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="https://images.pexels.com/photos/3184396/pexels-photo-3184396.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Comunidad"
                    className="rounded-2xl h-48 object-cover"
                  />
                  <img
                    src="https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Comunidad"
                    className="rounded-2xl h-48 object-cover"
                  />
                  <img
                    src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Comunidad"
                    className="rounded-2xl h-48 object-cover"
                  />
                  <img
                    src="https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Comunidad"
                    className="rounded-2xl h-48 object-cover"
                  />
                </div>
              </div>
            </div>

            <div>
              <Badge variant="pink" className="mb-4">Nuestra visión</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-6">
                Una Comunidad que Transforma
              </h2>
              <div className="space-y-4 text-lg text-[#1E1E1E] leading-relaxed mb-8">
                <p>
                  Somos una comunidad viva de mujeres, inclusiva y diversa, donde cada conexión es parte de un ciclo que empieza y termina en nosotras mismas.
                </p>
                <p>
                  Nuestro principio y fin es la circularidad. ¡Somos Mujeres Beginss, generando impacto real en nuestras vidas y en otras!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/pilares">
                  <Button variant="primary" className="text-lg px-8 py-4">
                    Conoce nuestra esencia
                  </Button>
                </Link>
                <Link to="/registro">
                  <Button variant="outlined" className="text-lg px-8 py-4">
                    Únete al círculo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#3B6E58] to-[#1E1E1E] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Infinity className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sé parte de esta transformación
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Cada mujer que se suma hace crecer la red, multiplica el impacto y fortalece el movimiento.
            Tu voz, tu experiencia y tu presencia son valiosas.
          </p>
          <Link to="/registro">
            <Button variant="cta" className="bg-white text-[#3B6E58] hover:bg-[#F7EFE9] text-lg px-8 py-4 shadow-2xl">
              Únete a Beginss
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
