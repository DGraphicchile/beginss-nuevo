import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, Heart, Palette, Leaf, TreePine, ShoppingBag, X, Calendar, MapPin, ShoppingCart, Coffee, Sparkles, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import FloatingElements from '../components/FloatingElements';
import { supabase } from '../lib/supabase';
import { parseCategoriesFromDescription } from '../constants/circulos';

interface CirculoData {
  id: string;
  icon: any;
  title: string;
  description: string;
  tags: string[];
  color: string;
}

interface ContentItem {
  id: string;
  type: 'producto' | 'cafecito' | 'intercambio';
  title: string;
  description: string;
  image: string;
  date?: string;
  location?: string;
  price?: string;
  tags: string[];
  /** Categorías (títulos de círculos) asignadas; usado para filtrar por círculo. */
  categories: string[];
}

export default function CirculoDetail() {
  const { circuloId } = useParams();
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const circulos: Record<string, CirculoData> = {
    'economia': {
      id: 'economia',
      icon: Briefcase,
      title: 'Economía y Trabajo Colaborativo',
      description: 'Emprendimiento, desarrollo profesional y redes de apoyo para crecer económicamente de forma consciente y colaborativa.',
      tags: ['Emprendimiento', 'Networking', 'Mentoría'],
      color: '#2D5444'
    },
    'armonia': {
      id: 'armonia',
      icon: Heart,
      title: 'Bienestar y Armonía Emocional',
      description: 'Espacios para el autocuidado, la salud mental y el bienestar emocional. Meditación, terapia y apoyo entre mujeres.',
      tags: ['Bienestar', 'Meditación', 'Terapia'],
      color: '#cf3f5c'
    },
    'arte': {
      id: 'arte',
      icon: Palette,
      title: 'Arte con Sentido',
      description: 'Creatividad que inspira y transforma. Talleres, proyectos artísticos y expresión a través del arte consciente.',
      tags: ['Creatividad', 'Talleres', 'Expresión'],
      color: '#9b7fbd'
    },
    'sostenibilidad': {
      id: 'sostenibilidad',
      icon: Leaf,
      title: 'Sostenibilidad en Acción',
      description: 'Prácticas sostenibles para el día a día. Reciclaje, zero waste y estilos de vida que cuidan el planeta.',
      tags: ['Zero Waste', 'Eco-friendly', 'DIY'],
      color: '#2D5444'
    },
    'medio-ambiente': {
      id: 'medio-ambiente',
      icon: TreePine,
      title: 'Medio Ambiente',
      description: 'Acción climática, conservación y proyectos ambientales. Juntas por un planeta más verde y saludable.',
      tags: ['Activismo', 'Conservación', 'Educación'],
      color: '#2D5444'
    },
    'consumo': {
      id: 'consumo',
      icon: ShoppingBag,
      title: 'Consumo con Sentido',
      description: 'Decisiones de compra conscientes. Apoyamos marcas éticas, comercio justo y economía circular.',
      tags: ['Comercio Justo', 'Ético', 'Local'],
      color: '#E2725B'
    }
  };

  const currentCirculo = (circuloId && circulos[circuloId]) ? circulos[circuloId] : circulos['economia'];
  const Icon = currentCirculo.icon;

  // Cargar contenido real de la base de datos
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const items: ContentItem[] = [];

      // Cargar cafecitos
      const { data: cafecitos, error: cafecitosError } = await supabase
        .from('cafecito_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (!cafecitosError && cafecitos) {
        cafecitos.forEach((cafecito: any) => {
          const categories = parseCategoriesFromDescription(cafecito.description || '');
          let tags: string[] = [];
          const tagsMatch = (cafecito.description || '').match(/Etiquetas:\s*([^\n]+)/);
          if (tagsMatch) {
            tags = tagsMatch[1].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
          }

          let cleanDescription = (cafecito.description || '')
            .replace(/\[Categoría:\s*[^\]]+\]\s*\n?\n?/gi, '')
            .replace(/\n?\n?Etiquetas:\s*[^\n]+/, '')
            .trim();

          items.push({
            id: cafecito.id,
            type: 'cafecito',
            title: cafecito.title,
            description: cleanDescription,
            image: cafecito.image_url || 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600',
            date: cafecito.event_date,
            location: cafecito.location,
            tags,
            categories,
          });
        });
      }

      // Cargar marketplace listings (productos e intercambios)
      const { data: listings, error: listingsError } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!listingsError && listings) {
        listings.forEach((listing: any) => {
          const listingType = listing.exchange_mode === 'barter' || listing.exchange_mode === 'time_bank'
            ? 'intercambio'
            : 'producto';
          const categories = (listing.category || '')
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);

          const imageUrl = listing.images && listing.images.length > 0
            ? listing.images[0]
            : 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600';

          items.push({
            id: listing.id,
            type: listingType,
            title: listing.title,
            description: listing.description || '',
            image: imageUrl,
            location: listing.location,
            price: listing.price ? `$${listing.price}` : listing.time_points ? `${listing.time_points} puntos` : undefined,
            tags: listing.tags || [],
            categories,
          });
        });
      }

      setContentItems(items);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'todos', label: 'Todos', icon: Sparkles },
    { id: 'producto', label: 'Productos', icon: ShoppingCart },
    { id: 'cafecito', label: 'Cafecito', icon: Coffee },
    { id: 'intercambio', label: 'Intercambio', icon: ShoppingBag }
  ];

  // Solo mostrar items que tengan la categoría del círculo actual; luego filtrar por tipo
  const itemsInCirculo = contentItems.filter((item) =>
    item.categories.some((c) => c === currentCirculo.title)
  );
  const filteredItems =
    activeFilter === 'todos'
      ? itemsInCirculo
      : itemsInCirculo.filter((item) => item.type === activeFilter);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'producto': 'Producto',
      'cafecito': 'Cafecito',
      'intercambio': 'Intercambio'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'producto': 'bg-[#2D5444]',
      'cafecito': 'bg-[#cf3f5c]',
      'intercambio': 'bg-[#9b7fbd]'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: `${currentCirculo.color}15` }}>
        <FloatingElements />

        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20" style={{ backgroundColor: currentCirculo.color }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/circulos" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-[#1E1E1E] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver a Círculos</span>
          </Link>

          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: currentCirculo.color }}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
                {currentCirculo.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {currentCirculo.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {currentCirculo.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: currentCirculo.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-lg">
            <h3 className="text-lg font-bold text-[#1E1E1E] mb-4">Otros Círculos de Acción</h3>
            <div className="flex flex-wrap gap-3">
              {Object.values(circulos).filter(c => c.id !== currentCirculo.id).map((circulo) => {
                const CircIcon = circulo.icon;
                return (
                  <Link
                    key={circulo.id}
                    to={`/circulos/${circulo.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border-2 hover:shadow-md transition-all"
                    style={{ borderColor: `${circulo.color}40` }}
                  >
                    <CircIcon className="w-4 h-4" style={{ color: circulo.color }} />
                    <span className="text-sm font-medium" style={{ color: circulo.color }}>{circulo.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>



      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-200'
                }`}
                style={activeFilter === filter.id ? { backgroundColor: currentCirculo.color } : {}}
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#e74865] border-t-transparent mb-4" />
              <p className="text-gray-600">Cargando contenido...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No hay contenido disponible en esta categoría todavía
              </p>
              <Button onClick={() => setActiveFilter('todos')} variant="secondary">
                Ver todo el contenido
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1E1E1E] mb-2 group-hover:text-[#cf3f5c] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    {item.date && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.date + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.price && (
                      <div className="text-lg font-bold mt-3" style={{ color: currentCirculo.color }}>
                        {item.price}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
                <X className="w-5 h-5" />
              </button>
              <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold text-white ${getTypeColor(selectedItem.type)}`}>
                {getTypeLabel(selectedItem.type)}
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-[#1E1E1E] mb-4">{selectedItem.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">{selectedItem.description}</p>

              {selectedItem.date && (
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(selectedItem.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}

              {selectedItem.location && (
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedItem.location}</span>
                </div>
              )}

              {selectedItem.price && (
                <div className="text-2xl font-bold mb-6" style={{ color: currentCirculo.color }}>
                  {selectedItem.price}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedItem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: `${currentCirculo.color}20`, color: currentCirculo.color }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <Button variant="cta" className="w-full text-lg py-4">
                {selectedItem.type === 'producto' ? 'Ver Producto' :
                 selectedItem.type === 'intercambio' ? 'Ver Intercambio' :
                 selectedItem.type === 'cafecito' ? 'Unirme al Cafecito' :
                 'Ver más información'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
