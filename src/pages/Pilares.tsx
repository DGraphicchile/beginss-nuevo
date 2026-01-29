import { Link } from 'react-router-dom';
import { Infinity, Users, Heart, Lightbulb, ArrowRight, Sparkles, Star } from 'lucide-react';
import Button from '../components/Button';
import WaveDivider from '../components/WaveDivider';
import FloatingElements from '../components/FloatingElements';

export default function Pilares() {
  const pilares = [
    {
      icon: Infinity,
      title: 'Circularidad con Propósito',
      description: 'Creamos ciclos de valor donde cada intercambio genera beneficios para toda la comunidad. Lo que compartes hoy, vuelve transformado mañana.',
      details: [
        'Banco de Tiempo Beginss para intercambios justos',
        'Economía regenerativa y colaborativa',
        'Recursos que circulan y se multiplican'
      ],
      color: '#F5C542'
    },
    {
      icon: Users,
      title: 'Comunidad Sorora e Inclusiva',
      description: 'Un espacio seguro donde todas las voces importan. Celebramos la diversidad y construimos desde la colaboración y el respeto mutuo.',
      details: [
        'Apoyo entre mujeres sin competencia',
        'Diversidad de edades, culturas y experiencias',
        'Conexiones auténticas y duraderas'
      ],
      color: '#cf3f5c'
    },
    {
      icon: Heart,
      title: 'Bienestar y Empoderamiento Colaborativo',
      description: 'Promovemos el cuidado integral: físico, emocional y espiritual. Crecemos juntas, compartiendo herramientas y sabiduría.',
      details: [
        'Talleres de autocuidado y desarrollo personal',
        'Espacios de escucha y apoyo emocional',
        'Fortalecimiento del poder interior'
      ],
      color: '#2D5444'
    },
    {
      icon: Lightbulb,
      title: 'Innovación y Sostenibilidad con Impacto',
      description: 'Buscamos soluciones creativas que respeten el planeta y generen impacto positivo. Innovamos con consciencia y propósito.',
      details: [
        'Consumo consciente y responsable',
        'Proyectos con impacto social y ambiental',
        'Tecnología al servicio del bien común'
      ],
      color: '#1E1E1E'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#F7EFE9] via-[#FAFAFA] to-[#FFFFFF]">
        <FloatingElements />

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2D5444]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F5C542]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white rounded-full shadow-lg border border-gray-200">
              <Sparkles className="w-4 h-4 text-[#2D5444]" />
              <span className="text-[#1E1E1E] text-sm font-bold uppercase tracking-wider">Fundamentos</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1E1E1E] mb-6 leading-tight">
              Nuestros Pilares
            </h1>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4 leading-relaxed">
              En esta comunidad, cada acción nace de principios claros que nos unen y nos inspiran.
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Desde la circularidad y el trabajo colaborativo, impulsamos el bienestar y el consumo consciente.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {pilares.map((pilar, index) => (
              <div key={index} className="relative group">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: pilar.color }}></div>
                <div className="relative bg-white rounded-[2.5rem] p-10 shadow-lg hover:shadow-xl transition-all">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md" style={{ backgroundColor: pilar.color }}>
                    <pilar.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#1E1E1E] mb-4">{pilar.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">{pilar.description}</p>

                  <ul className="space-y-3 mb-6">
                    {pilar.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ backgroundColor: pilar.color }} />
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 font-medium group-hover:translate-x-2 transition-transform" style={{ color: pilar.color }}>
                    <span>Explorar más</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-[#2D5444] rounded-[3rem] opacity-5"></div>
            <div className="relative text-center p-12 bg-white rounded-[3rem] border-2 border-[#2D5444]">
              <div className="max-w-3xl mx-auto">
                <p className="text-3xl font-bold text-[#1E1E1E] mb-4">
                  Los valores se convierten en acciones
                </p>
                <p className="text-xl text-gray-600 mb-8">
                  Las ideas en proyectos reales que transforman vidas
                </p>
                <Link to="/circulos">
                  <Button variant="cta">
                    Explora los Círculos de Acción
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="#ffffff" flip={true} />

      <section className="pt-0 pb-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute top-40 right-10 w-3 h-3 bg-[#F5C542] rounded-full"></div>
        <div className="absolute bottom-40 left-10 w-2 h-2 bg-[#E2725B] rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 border-4 border-[#2D5444] rounded-full opacity-5"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center p-12 bg-gradient-to-br from-[#2D5444] to-[#1E1E1E] rounded-[3rem] text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <Infinity className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Únete y sé parte del cambio
              </h2>
              <p className="text-xl mb-8 text-white/90 leading-relaxed max-w-3xl mx-auto">
                Estos pilares cobran vida en nuestros Círculos de Acción, donde puedes participar activamente
              </p>
              <Link to="/registro">
                <Button variant="cta" className="bg-white text-[#2D5444] hover:bg-[#F7EFE9] text-lg px-8 py-4 shadow-2xl">
                  Únete a Beginss
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
