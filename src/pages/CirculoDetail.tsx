import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { Briefcase, Heart, Palette, Leaf, TreePine, ShoppingBag, X, Calendar, MapPin, ShoppingCart, Coffee, Sparkles, ArrowLeft, Lock } from 'lucide-react';
import Button from '../components/Button';
import FloatingElements from '../components/FloatingElements';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { parseCategoriesFromDescription, circuloIdFromTitle } from '../constants/circulos';

interface CirculoMeta {
  id: string;
  icon: any;
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
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'en' ? 'en-US' : i18n.language === 'pt-BR' ? 'pt-BR' : 'es-ES';

  const circulosMeta: Record<string, CirculoMeta> = {
    'economia': { id: 'economia', icon: Briefcase, color: '#2D5444' },
    'armonia': { id: 'armonia', icon: Heart, color: '#cf3f5c' },
    'arte': { id: 'arte', icon: Palette, color: '#9b7fbd' },
    'sostenibilidad': { id: 'sostenibilidad', icon: Leaf, color: '#2D5444' },
    'medio-ambiente': { id: 'medio-ambiente', icon: TreePine, color: '#2D5444' },
    'consumo': { id: 'consumo', icon: ShoppingBag, color: '#E2725B' }
  };

  const effectiveId = (circuloId && circulosMeta[circuloId]) ? circuloId : 'economia';
  const meta = circulosMeta[effectiveId];
  const Icon = meta.icon;
  const currentCirculo = {
    ...meta,
    title: t(`circulosPage.circles.${effectiveId}.title`),
    description: t(`circulosPage.circles.${effectiveId}.description`),
    tags: t(`circulosPage.circles.${effectiveId}.tags`, { returnObjects: true }) as string[],
  };

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
    { id: 'todos', labelKey: 'circulosPage.filters.todos', icon: Sparkles },
    { id: 'producto', labelKey: 'circulosPage.filters.productos', icon: ShoppingCart },
    { id: 'cafecito', labelKey: 'circulosPage.filters.cafecito', icon: Coffee },
    { id: 'intercambio', labelKey: 'circulosPage.filters.intercambio', icon: ShoppingBag }
  ];

  // Solo mostrar items que tengan la categoría del círculo actual (por id); luego filtrar por tipo
  const itemsInCirculo = contentItems.filter((item) =>
    item.categories.some((c) => circuloIdFromTitle(c) === effectiveId)
  );
  const filteredItems =
    activeFilter === 'todos'
      ? itemsInCirculo
      : itemsInCirculo.filter((item) => item.type === activeFilter);

  const getTypeLabel = (type: string) => t(`circulosPage.typeLabels.${type}`) || type;

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
            <span className="text-sm font-medium">{t('circulosPage.backToCirculos')}</span>
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
            <h3 className="text-lg font-bold text-[#1E1E1E] mb-4">{t('circulosPage.otherCirclesTitle')}</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(circulosMeta).filter(([id]) => id !== effectiveId).map(([id, circulo]) => {
                const CircIcon = circulo.icon;
                const circleTitle = t(`circulosPage.circles.${id}.title`);
                return (
                  <Link
                    key={id}
                    to={`/circulos/${id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border-2 hover:shadow-md transition-all"
                    style={{ borderColor: `${circulo.color}40` }}
                  >
                    <CircIcon className="w-4 h-4" style={{ color: circulo.color }} />
                    <span className="text-sm font-medium" style={{ color: circulo.color }}>{circleTitle}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>



      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {!user ? (
            <div className="min-h-[50vh] flex items-center justify-center py-12">
              <div className="max-w-lg w-full text-center">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
                  style={{ backgroundColor: `${currentCirculo.color}20` }}
                >
                  <Lock className="w-10 h-10" style={{ color: currentCirculo.color }} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E1E1E] mb-4">
                  {t('circulosPage.gate.title')}
                </h2>
                <p className="text-lg text-[#5e3920] leading-relaxed mb-8">
                  <Trans i18nKey="circulosPage.gate.description" values={{ name: currentCirculo.title }} components={{ strong: <strong /> }} />
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/registro">
                    <Button variant="cta" className="w-full sm:w-auto">
                      {t('circulosPage.gate.createAccount')}
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outlined" className="w-full sm:w-auto">
                      {t('circulosPage.gate.alreadyHaveAccount')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
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
                    {t(filter.labelKey)}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#e74865] border-t-transparent mb-4" />
                  <p className="text-gray-600">{t('circulosPage.loadingContent')}</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    {t('circulosPage.noContent')}
                  </p>
                  <Button onClick={() => setActiveFilter('todos')} variant="secondary">
                    {t('circulosPage.viewAllContent')}
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
                          <span>{new Date(item.date + 'T00:00:00').toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
            </>
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
                  <span>{new Date(selectedItem.date + 'T00:00:00').toLocaleDateString(dateLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
                {selectedItem.type === 'producto' ? t('circulosPage.viewProduct') :
                 selectedItem.type === 'intercambio' ? t('circulosPage.viewIntercambio') :
                 selectedItem.type === 'cafecito' ? t('circulosPage.joinCafecito') :
                 t('circulosPage.viewMoreInfo')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
