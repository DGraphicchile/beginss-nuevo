import { useState } from 'react';
import { Repeat, Package, Search, Heart, Sparkles, Users } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import FloatingElements from '../components/FloatingElements';
import RequireAuth from '../components/RequireAuth';

interface TruequeItem {
  id: string;
  title: string;
  description: string;
  offering: string;
  seeking: string;
  category: string;
  image: string;
  user: {
    name: string;
    avatar: string;
    location: string;
  };
}

export default function Trueque() {
  const [selectedItem, setSelectedItem] = useState<TruequeItem | null>(null);

  const truequeItems: TruequeItem[] = [
    {
      id: '1',
      title: 'Set de Vajilla Artesanal',
      description: 'Hermoso set de platos y tazas de cerámica hechos a mano. Perfecto estado, colores cálidos.',
      offering: 'Set de vajilla de cerámica (6 piezas)',
      seeking: 'Libros de cocina o plantas para el hogar',
      category: 'Hogar',
      image: 'https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'María González',
        avatar: 'https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'Bogotá'
      }
    },
    {
      id: '2',
      title: 'Ropa Vintage de Calidad',
      description: 'Colección de prendas vintage en excelente estado. Tallas M-L. Estilo bohemio y elegante.',
      offering: '10 prendas de ropa vintage',
      seeking: 'Accesorios de yoga o productos de skincare natural',
      category: 'Moda',
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Laura Pérez',
        avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'Medellín'
      }
    },
    {
      id: '3',
      title: 'Juegos de Mesa Educativos',
      description: 'Tres juegos de mesa para niños, educativos y divertidos. Como nuevos.',
      offering: '3 juegos de mesa infantiles',
      seeking: 'Cuentos infantiles o material de arte',
      category: 'Educación',
      image: 'https://images.pexels.com/photos/8111856/pexels-photo-8111856.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Camila Flores',
        avatar: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'Cali'
      }
    },
    {
      id: '4',
      title: 'Kit de Jardinería Completo',
      description: 'Herramientas de jardinería en buen estado, incluye macetas y semillas orgánicas.',
      offering: 'Set de herramientas de jardinería',
      seeking: 'Productos de limpieza ecológicos o contenedores',
      category: 'Sostenibilidad',
      image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Ana Silva',
        avatar: 'https://images.pexels.com/photos/4587979/pexels-photo-4587979.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'Bogotá'
      }
    },
    {
      id: '5',
      title: 'Material de Arte Profesional',
      description: 'Óleos, pinceles y lienzos. Ideal para artistas. Poco uso.',
      offering: 'Kit completo de pintura al óleo',
      seeking: 'Cursos online o talleres de fotografía',
      category: 'Arte',
      image: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Daniela Ortiz',
        avatar: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'Cartagena'
      }
    },
    {
      id: '6',
      title: 'Equipo de Yoga Completo',
      description: 'Mat, bloques, correa y bolster de yoga. Excelente calidad y estado.',
      offering: 'Set completo de yoga',
      seeking: 'Aceites esenciales o velas aromáticas',
      category: 'Bienestar',
      image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Valentina Cruz',
        avatar: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'Medellín'
      }
    }
  ];

  return (
  <RequireAuth title="Trueque" titleKey="auth.sectionNames.trueque" sectionName="trueque">
  <div className="min-h-screen bg-white">
    {/* HERO */}
<section
  className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-center bg-cover bg-no-repeat"
  style={{ backgroundImage: "url('/img-header-trueque.jpg')" }}
>
  <div className="absolute inset-0" /> {/* Oscurece la imagen un poco */}
  <FloatingElements />

  {/* Círculos decorativos */}
  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F7EFE9] rounded-full opacity-40 blur-3xl -z-10" />
  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#CF3F7A]/20 rounded-full blur-3xl -z-10" />

  {/* Contenido principal */}
  <div className="max-w-7xl mx-auto relative z-10 text-center text-white">
    {/* Badge*/}
    <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full shadow-lg bg-white backdrop-blur-md">
      <Repeat className="w-5 h-5 text-[#01492b] drop-shadow-md" />
      <span className="text-[#2D5444] text-base font-bold uppercase tracking-wider drop-shadow">
        Intercambio Directo
      </span>
    </div>

    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow">
      Trueque Directo
    </h1>

    <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow">
      Intercambia productos o servicios con otras mujeres Beginss.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        variant="primary"
        className="text-lg px-8 py-4 bg-[#2D5444] hover:bg-[#01492b] text-white shadow-xl"
      >
        Explorar Trueques
      </Button>
      <Button
        variant="secondary"
        className="text-lg px-8 py-4 bg-[#CF3F7A] text-white border-2 border-[#CF3F7A] hover:bg-[#F5C542] hover:border-[#F5C542] hover:text-white shadow-xl transition-all duration-300"
      >
        Publicar Trueque
      </Button>
    </div>
  </div>
</section>

    {/* CÓMO FUNCIONA */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7EFE9]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[#2D5444] text-center mb-4">
          ¿Cómo funciona?
        </h2>
        <p className="text-center text-[#5e3920] mb-12 max-w-2xl mx-auto">
          Tres pasos simples para intercambiar con confianza
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#F5C542] rounded-full flex items-center justify-center mb-6 mx-auto">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2D5444] mb-3 text-center">Publica lo que ofreces</h3>
            <p className="text-[#5e3920] text-center leading-relaxed">
              Describe lo que tienes para intercambiar y qué buscas a cambio.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#b2d9d9] rounded-full flex items-center justify-center mb-6 mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2D5444] mb-3 text-center">Conecta con otras</h3>
            <p className="text-[#5e3920] text-center leading-relaxed">
              Encuentra mujeres que tengan lo que buscas y viceversa.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#CF3F7A] rounded-full flex items-center justify-center mb-6 mx-auto">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2D5444] mb-3 text-center">Coordina el intercambio</h3>
            <p className="text-[#5e3920] text-center leading-relaxed">
              Acuerda los detalles y realiza el trueque de forma segura.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* TRUEQUES DISPONIBLES */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-3 h-3 bg-[#F5C542] rounded-full" />
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-[#CF3F7A] rounded-full" />
      <Sparkles className="absolute top-1/2 left-10 w-6 h-6 text-[#b2d9d9]/30" />

      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[#2D5444] text-center mb-12">
          Trueques Disponibles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {truequeItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#f6ecdc] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="pink" className="bg-[#CF3F7A] text-white">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2D5444] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5e3920] mb-4 line-clamp-2">{item.description}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-[#2D5444] min-w-[60px]">Ofrezco:</span>
                    <span className="text-[#5e3920]">{item.offering}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-[#2D5444] min-w-[60px]">Busco:</span>
                    <span className="text-[#5e3920]">{item.seeking}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#5e3920]/10">
                  <img
                    src={item.user.avatar}
                    alt={item.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2D5444] text-sm">{item.user.name}</p>
                    <p className="text-xs text-[#5e3920]/70">{item.user.location}</p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full mt-4 bg-[#2D5444] hover:bg-[#01492b] text-white"
                >
                  Ver detalle
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA FINAL */}
   <section
  className="py-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/footer-trueque.jpg')" }}
>
  {/* Capa de oscurecimiento para legibilidad */}
  <div className="absolute inset-0 bg-black/45" />

  <div className="max-w-4xl mx-auto text-center relative z-10">
    <Heart className="w-16 h-16 mx-auto mb-6 text-[#F5C542]" />
    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
      Lo que no usas puede ser valioso para otra
    </h2>
    <p className="text-xl mb-8 text-white/90">
      ¡Truequea hoy y dale una segunda vida a tus objetos!
    </p>
    <Button
      variant="cta"
      className="bg-[#F5C542] hover:bg-[#F5C542]/90 text-[#5e3920] text-lg px-10 py-4 shadow-2xl rounded-full"
    >
      Publicar mi trueque
    </Button>
  </div>
</section>


    {/* MODAL */}
    {selectedItem && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => setSelectedItem(null)}
      >
        <div
          className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className="w-full h-64 object-cover rounded-t-[2rem]"
            />
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-8">
            <Badge variant="pink" className="bg-[#CF3F7A] text-white mb-4">
              {selectedItem.category}
            </Badge>

            <h2 className="text-3xl font-bold text-[#2D5444] mb-4">{selectedItem.title}</h2>
            <p className="text-lg text-[#5e3920] leading-relaxed mb-6">{selectedItem.description}</p>

            <div className="space-y-4 mb-6 bg-[#F7EFE9] rounded-[1.5rem] p-6">
              <div>
                <h3 className="font-bold text-[#2D5444] mb-2">Ofrezco:</h3>
                <p className="text-[#5e3920]">{selectedItem.offering}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#2D5444] mb-2">Busco a cambio:</h3>
                <p className="text-[#5e3920]">{selectedItem.seeking}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <img
                src={selectedItem.user.avatar}
                alt={selectedItem.user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-[#2D5444]">{selectedItem.user.name}</h3>
                <p className="text-sm text-[#5e3920]/70">{selectedItem.user.location}</p>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full text-lg py-4 bg-[#CF3F7A] hover:bg-[#CF3F7A]/90 text-white"
            >
              Contactar usuaria
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
  </RequireAuth>
);
} 
