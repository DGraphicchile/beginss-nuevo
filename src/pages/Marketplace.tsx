import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Leaf, Star, MapPin, Heart, Sparkles, Repeat, ArrowRight, X, Upload, Plus, Phone } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useToast } from '../lib/ToastContext';
import { supabase, MarketplaceListing } from '../lib/supabase';
import { CIRCULOS_CATEGORIAS, CATEGORIAS_TITULOS } from '../constants/circulos';
import Badge from '../components/Badge';
import Button from '../components/Button';
import WaveDivider from '../components/WaveDivider';
import FloatingElements from '../components/FloatingElements';

interface Product extends MarketplaceListing {
  profiles?: {
    full_name: string;
    avatar_url?: string;
    location?: string;
    phone_number?: string;
  };
}

export default function Marketplace() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [viewMode, setViewMode] = useState<'marketplace' | 'trueque'>('marketplace');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [interestedListingIds, setInterestedListingIds] = useState<Set<string>>(new Set());
  const [savingInterest, setSavingInterest] = useState<string | null>(null);
  
  // Form states
  const [productType, setProductType] = useState<'marketplace' | 'trueque' | null>(null);
  const [formData, setFormData] = useState({
    categories: [] as string[],
    name: '',
    title: '',
    tags: [] as string[],
    tagInput: '',
    deliveryAddress: '',
    exchangeAddress: '',
    images: [] as File[],
    imagePreviews: [] as string[],
    quantity: '',
    price: '',
    description: '',
    offerType: 'ofrecer' as 'buscar' | 'ofrecer',
  });

  const categories = [
    { id: 'todos', label: 'Todos', icon: ShoppingBag },
    ...CIRCULOS_CATEGORIAS.map((c) => ({ id: c.title, label: c.title, icon: Leaf })),
  ];

  useEffect(() => {
    loadProducts();
  }, [viewMode, activeCategory]);

  useEffect(() => {
    if (!user) { setInterestedListingIds(new Set()); return; }
    supabase.from('marketplace_listing_interest').select('listing_id').eq('user_id', user.id.toString()).then(({ data }) => {
      setInterestedListingIds(new Set((data || []).map((r: { listing_id: string }) => r.listing_id)));
    });
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('marketplace_listings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            location,
            phone_number
          )
        `)
        .eq('status', 'active');

      // Filtrar por tipo: marketplace (sale) o trueque (barter)
      if (viewMode === 'marketplace') {
        query = query.eq('exchange_mode', 'sale');
      } else {
        query = query.eq('exchange_mode', 'barter');
      }

      // Filtrar por categoría (circle title; category guarda títulos separados por coma)
      if (activeCategory !== 'todos') {
        query = query.ilike('category', `%${activeCategory}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading products:', error);
      } else {
        setProducts((data || []) as Product[]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = [...formData.images, ...files];
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      
      setFormData({
        ...formData,
        images: newImages,
        imagePreviews: newPreviews,
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = formData.imagePreviews.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
      imagePreviews: newPreviews,
    });
  };

  const addTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: '',
      });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!user) return [];
    
    const uploadedUrls: string[] = [];
    
    for (const image of formData.images) {
      try {
        const fileExt = image.name.split('.').pop();
        const fileName = `marketplace/${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('images')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
        
        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Debes iniciar sesión para publicar un producto', 'warning');
      return;
    }

    try {
      // Subir imágenes
      const imageUrls = await uploadImages();
      
      if (imageUrls.length === 0 && formData.images.length > 0) {
        showToast('Error al subir las imágenes. Intenta de nuevo.', 'error');
        return;
      }

      // Preparar datos según el tipo
      const listingData: any = {
        user_id: user.id,
        title: productType === 'marketplace' ? formData.name : formData.title,
        description: formData.description,
        listing_type: 'product',
        exchange_mode: productType === 'marketplace' ? 'sale' : 'barter',
        category: formData.categories.join(', '),
        images: imageUrls.length > 0 ? imageUrls : [],
        location: productType === 'marketplace' ? formData.deliveryAddress : formData.exchangeAddress,
        tags: formData.tags,
        status: 'active',
      };

      if (productType === 'marketplace') {
        listingData.price = parseFloat(formData.price) || null;
        // Guardar cantidad en tags
        if (formData.quantity) {
          listingData.tags = [...listingData.tags, `cantidad:${formData.quantity}`];
        }
      } else {
        // Para trueque, guardar el tipo de oferta en tags
        listingData.tags = [...listingData.tags, `tipo:${formData.offerType}`];
        if (formData.quantity) {
          listingData.tags = [...listingData.tags, `cantidad:${formData.quantity}`];
        }
      }

      // Guardar en marketplace_listings
      const { data: listing, error: listingError } = await supabase
        .from('marketplace_listings')
        .insert([listingData])
        .select()
        .single();

      if (listingError) {
        console.error('Error creating listing:', listingError);
        showToast('Error al crear el producto. Intenta de nuevo.', 'error');
        return;
      }

      // Crear actividad en user_activities
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert([{
          user_id: user.id.toString(),
          activity_type: productType === 'marketplace' ? 'marketplace' : 'trueque',
          activity_id: listing.id,
          title: listingData.title,
          description: listingData.description,
          created_by_me: true,
        }]);

      if (activityError) {
        console.error('Error creating activity:', activityError);
        // No fallar si la actividad no se crea
      }

      // Limpiar formulario y cerrar modal
      setFormData({
        categories: [],
        name: '',
        title: '',
        tags: [],
        tagInput: '',
        deliveryAddress: '',
        exchangeAddress: '',
        images: [],
        imagePreviews: [],
        quantity: '',
        price: '',
        description: '',
        offerType: 'ofrecer',
      });
      setProductType('marketplace');
      setShowModal(false);
      
      // Recargar productos
      loadProducts();
      
      showToast('Producto publicado exitosamente', 'success');
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('Error al publicar el producto. Intenta de nuevo.', 'error');
    }
  };

  const handleMeInteresa = async (listingId: string, title: string, description: string, exchangeMode: string) => {
    if (!user || savingInterest) return;
    setSavingInterest(listingId);
    const activityType = exchangeMode === 'barter' ? 'trueque' : 'marketplace';
    const { error: actErr } = await supabase.from('user_activities').insert({
      user_id: user.id.toString(),
      activity_type: activityType,
      activity_id: listingId,
      title,
      description: (description || '').slice(0, 200),
      created_by_me: false,
    });
    const { error: intErr } = await supabase.from('marketplace_listing_interest').insert({
      listing_id: listingId,
      user_id: user.id.toString(),
    });
    setSavingInterest(null);
    if (intErr && intErr.code !== '23505') {
      showToast('No se pudo registrar tu interés.', 'error');
      return;
    }
    setInterestedListingIds((prev) => new Set([...prev, listingId]));
    showToast('¡Interés guardado! Aparecerá en tu perfil en "Me interesó".', 'success');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredProducts = products.filter(product => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh] pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]">
          <img
            src="/mujeresmarketplace-66.jpg"
            alt="Beginss Community"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>

        <FloatingElements />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
              <ShoppingBag className="w-4 h-4 text-[#7CA982]" />
              <span className="text-[#3E6049] text-sm font-semibold">Marketplace consciente</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Marketplace de{' '}
              <span className="text-[#b2d9d9]">Mujeres Beginss</span>
            </h1>

            <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Cada compra es un acto de apoyo y cada venta, una oportunidad para crecer.{' '}
              <span className="font-semibold text-[#b2d9d9]">Compra con impacto. Vende con sentido. Crezcamos juntas.</span>
            </p>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8E8E]" />
                <input
                  type="text"
                  placeholder="Busca productos, servicios o emprendedoras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-[#7CA982] focus:outline-none text-[#5F5F5F] shadow-lg"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button 
                  variant="primary" 
                  className="text-lg px-8 py-4"
                  onClick={() => setShowModal(true)}
                >
                  Publicar mi producto
                </Button>
              ) : (
                <Button variant="primary" className="text-lg px-8 py-4">
                  Únete para vender
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="#FAF7F2" />

      {/* Selector Marketplace/Trueque */}
      <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-full p-2 shadow-lg">
              <button
                onClick={() => setViewMode('marketplace')}
                className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'marketplace'
                    ? 'bg-[#7CA982] text-white shadow-md'
                    : 'text-[#5F5F5F] hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                Marketplace
              </button>
              <button
                onClick={() => setViewMode('trueque')}
                className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'trueque'
                    ? 'bg-[#F5C542] text-white shadow-md'
                    : 'text-[#5F5F5F] hover:bg-gray-50'
                }`}
              >
                <Repeat className="w-5 h-5" />
                Trueque
              </button>
            </div>
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-[#7CA982] text-white shadow-lg'
                    : 'bg-white text-[#5F5F5F] hover:bg-gray-50 shadow-md'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>

          {/* Productos */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#6E6E6E]">Cargando productos...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative h-44 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {product.exchange_mode === 'barter' ? (
                      <div className="absolute top-3 right-3 bg-[#F5C542] text-[#1E1E1E] px-3 py-1 rounded-full text-xs font-semibold">
                        Trueque
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-[#7CA982] text-[#1E1E1E] px-3 py-1 rounded-full text-xs font-semibold">
                        Marketplace
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      {(() => {
                        const cats = (product.category || '').split(',').map((c) => c.trim()).filter(Boolean);
                        const n = cats.length;
                        if (n === 0) return null;
                        return (
                          <Badge variant="celeste" className="text-xs">
                            {n === 1 ? '1 categoría' : `${n} categorías`}
                          </Badge>
                        );
                      })()}
                    </div>

                    <h3 className="font-bold text-[#1E1E1E] mb-2 line-clamp-2 text-sm group-hover:text-[#5F5F5F] transition-colors">
                      {product.title}
                    </h3>

                    {product.profiles && (
                      <div className="flex items-center gap-2 mb-3">
                        {product.profiles.avatar_url ? (
                          <img
                            src={product.profiles.avatar_url}
                            alt={product.profiles.full_name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-600 font-semibold">
                              {product.profiles.full_name[0]}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-[#8E8E8E] truncate">{product.profiles.full_name}</p>
                      </div>
                    )}

                    {product.exchange_mode === 'sale' && product.price && (
                      <p className="text-lg font-bold text-[#2D5444]">
                        {formatPrice(product.price)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-[#6E6E6E]">
                No hay {viewMode === 'marketplace' ? 'productos' : 'trueques'} disponibles
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section-spacing px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/3.jpg"
            alt="Beginss Marketplace"
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
            ¿Lista para vender o intercambiar?
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Publica tus productos o servicios y conecta con miles de mujeres que valoran el comercio consciente.
          </p>
          {user ? (
            <Button 
              variant="cta" 
              className="bg-white text-[#7CA982] hover:bg-gray-50 text-lg px-8 py-4 shadow-2xl"
              onClick={() => setShowModal(true)}
            >
              Publicar mi primer producto
            </Button>
          ) : (
            <Button variant="cta" className="bg-white text-[#7CA982] hover:bg-gray-50 text-lg px-8 py-4 shadow-2xl">
              Crear cuenta y vender
            </Button>
          )}
        </div>
      </section>

      {/* Modal para crear producto */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setShowModal(false);
            setProductType(null);
            setFormData({
              categories: [],
              name: '',
              title: '',
              tags: [],
              tagInput: '',
              deliveryAddress: '',
              exchangeAddress: '',
              images: [],
              imagePreviews: [],
              quantity: '',
              price: '',
              description: '',
              offerType: 'ofrecer',
            });
          }}
        >
          <div 
            className="bg-white rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-[2rem] z-10">
              <h2 className="text-2xl font-bold text-[#1E1E1E]">Publicar producto</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setProductType(null);
                  setFormData({
                    categories: [],
                    name: '',
                    title: '',
                    tags: [],
                    tagInput: '',
                    deliveryAddress: '',
                    exchangeAddress: '',
                    images: [],
                    imagePreviews: [],
                    quantity: '',
                    price: '',
                    description: '',
                    offerType: 'ofrecer',
                  });
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Selección de tipo */}
              {!productType || productType === null ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1E1E1E] mb-4">Selecciona el tipo de producto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setProductType('marketplace')}
                      className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#7CA982] hover:bg-[#7CA982]/5 transition-all text-left"
                    >
                      <ShoppingBag className="w-8 h-8 text-[#7CA982] mb-3" />
                      <h4 className="text-xl font-bold text-[#1E1E1E] mb-2">Marketplace</h4>
                      <p className="text-gray-600">Venta de productos y servicios</p>
                    </button>
                    <button
                      onClick={() => setProductType('trueque')}
                      className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#F5C542] hover:bg-[#F5C542]/5 transition-all text-left"
                    >
                      <Repeat className="w-8 h-8 text-[#F5C542] mb-3" />
                      <h4 className="text-xl font-bold text-[#1E1E1E] mb-2">Trueque</h4>
                      <p className="text-gray-600">Intercambio sin dinero</p>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setProductType(null as any)}
                      className="text-[#7CA982] hover:text-[#5a8a6a] transition-colors"
                    >
                      ← Cambiar tipo
                    </button>
                    <Badge variant={productType === 'marketplace' ? 'green' : 'pink'} className="flex items-center gap-2">
                      {productType === 'marketplace' ? <ShoppingBag className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                      {productType === 'marketplace' ? 'Marketplace' : 'Trueque'}
                    </Badge>
                  </div>

                  {/* Categorías (Círculos de acción) - multi-select */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Categorías * (puedes elegir varias)</label>
                    <div className="border-2 border-gray-200 rounded-2xl p-4 focus-within:border-[#7CA982] focus-within:ring-2 focus-within:ring-[#7CA982]/20 transition-all max-h-48 overflow-y-auto">
                      {CATEGORIAS_TITULOS.map((titulo) => (
                        <label key={titulo} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2">
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(titulo)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, categories: [...formData.categories, titulo] });
                              } else {
                                setFormData({ ...formData, categories: formData.categories.filter((c) => c !== titulo) });
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#7CA982] focus:ring-[#7CA982]"
                          />
                          <span className="text-sm text-[#1E1E1E]">{titulo}</span>
                        </label>
                      ))}
                    </div>
                    {formData.categories.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Seleccionadas: {formData.categories.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Nombre/Título según tipo */}
                  {productType === 'marketplace' ? (
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Nombre del producto *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Set de Cosmética Natural"
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Título del trueque *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ej: Intercambio de servicios de diseño"
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                      />
                    </div>
                  )}

                  {/* Etiquetas */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Etiquetas</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#7CA982]/10 text-[#7CA982] rounded-full text-sm font-semibold flex items-center gap-2"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-[#5a8a6a]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.tagInput}
                        onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && formData.tagInput.trim()) {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="Escribe una etiqueta y presiona Enter"
                        className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                      />
                      <Button
                        type="button"
                        variant="primary"
                        onClick={addTag}
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>

                  {/* Imagen */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Imágenes del producto</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
                      {formData.imagePreviews.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {formData.imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-xl"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {formData.imagePreviews.length < 6 && (
                        <label className="cursor-pointer block text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-2">Haz clic para subir imágenes</p>
                          <p className="text-sm text-gray-400">PNG, JPG hasta 5MB (máx. 6 imágenes)</p>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Dirección según tipo */}
                  {productType === 'marketplace' ? (
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Dirección de entrega *</label>
                      <input
                        type="text"
                        required
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        placeholder="Ej: Calle 123, Bogotá"
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Dirección de intercambio *</label>
                      <input
                        type="text"
                        required
                        value={formData.exchangeAddress}
                        onChange={(e) => setFormData({ ...formData, exchangeAddress: e.target.value })}
                        placeholder="Ej: Calle 123, Bogotá"
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                      />
                    </div>
                  )}

                  {/* Tipo de oferta solo para trueque */}
                  {productType === 'trueque' && (
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-3">Tipo de oferta *</label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, offerType: 'ofrecer' })}
                          className={`flex-1 px-6 py-4 rounded-xl border-2 font-semibold transition-all ${
                            formData.offerType === 'ofrecer'
                              ? 'border-[#7CA982] bg-[#7CA982]/10 text-[#7CA982]'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          Ofrecer
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, offerType: 'buscar' })}
                          className={`flex-1 px-6 py-4 rounded-xl border-2 font-semibold transition-all ${
                            formData.offerType === 'buscar'
                              ? 'border-[#7CA982] bg-[#7CA982]/10 text-[#7CA982]'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          Buscar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Cantidad */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="Ej: 1, 2, 5..."
                      className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Precio solo para marketplace */}
                  {productType === 'marketplace' && (
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Precio *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Ej: 45000"
                        className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                      />
                    </div>
                  )}

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">Descripción *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe tu producto o trueque..."
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowModal(false);
                        setProductType(null as any);
                        setFormData({
                          categories: [],
                          name: '',
                          title: '',
                          tags: [],
                          tagInput: '',
                          deliveryAddress: '',
                          exchangeAddress: '',
                          images: [],
                          imagePreviews: [],
                          quantity: '',
                          price: '',
                          description: '',
                          offerType: 'ofrecer',
                        });
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="cta"
                      className="flex-1"
                      disabled={
                        formData.categories.length === 0 ||
                        !formData.description ||
                        (productType === 'marketplace' && (!formData.name || !formData.deliveryAddress || !formData.price)) ||
                        (productType === 'trueque' && (!formData.title || !formData.exchangeAddress))
                      }
                    >
                      Publicar producto
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del producto */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="w-full h-64 object-cover rounded-t-[2rem]"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-t-[2rem]">
                  <ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              {selectedProduct.exchange_mode === 'barter' ? (
                <div className="absolute top-4 left-4 bg-[#F5C542] text-[#1E1E1E] px-3 py-1 rounded-full text-sm font-semibold">
                  Trueque
                </div>
              ) : (
                <div className="absolute top-4 left-4 bg-[#7CA982] text-[#1E1E1E] px-3 py-1 rounded-full text-sm font-semibold">
                  Marketplace
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {(selectedProduct.category || '')
                  .split(',')
                  .map((c) => c.trim())
                  .filter(Boolean)
                  .map((cat) => (
                    <Badge key={cat} variant="celeste">
                      {cat}
                    </Badge>
                  ))}
              </div>

              <h2 className="text-3xl font-bold text-[#1E1E1E] mb-4">
                {selectedProduct.title}
              </h2>

              {selectedProduct.profiles && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    {selectedProduct.profiles.avatar_url ? (
                      <img
                        src={selectedProduct.profiles.avatar_url}
                        alt={selectedProduct.profiles.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg text-gray-600 font-semibold">
                          {selectedProduct.profiles.full_name[0]}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-[#1E1E1E]">{selectedProduct.profiles.full_name}</p>
                      {selectedProduct.profiles.location && (
                        <div className="flex items-center gap-1 text-sm text-[#8E8E8E]">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedProduct.profiles.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedProduct.exchange_mode === 'sale' && selectedProduct.price && (
                    <p className="text-4xl font-bold text-[#2D5444]">
                      {formatPrice(selectedProduct.price)}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#1E1E1E] mb-2">Descripción</h3>
                <p className="text-[#5F5F5F] leading-relaxed whitespace-pre-wrap">
                  {selectedProduct.description}
                </p>
              </div>

              {(() => {
                // Extraer cantidad de los tags
                const cantidadTag = selectedProduct.tags?.find(tag => tag.startsWith('cantidad:'));
                const cantidad = cantidadTag ? cantidadTag.replace('cantidad:', '') : null;
                const filteredTags = selectedProduct.tags?.filter(tag => !tag.startsWith('cantidad:') && !tag.startsWith('tipo:')) || [];

                return (
                  <>
                    {cantidad && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#1E1E1E] mb-2">Cantidad</h3>
                        <p className="text-[#5F5F5F]">{cantidad} {cantidad === '1' ? 'unidad' : 'unidades'}</p>
                      </div>
                    )}

                    {selectedProduct.location && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#1E1E1E] mb-2 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#8E8E8E]" />
                          {selectedProduct.exchange_mode === 'sale' ? 'Dirección de entrega' : 'Dirección de intercambio'}
                        </h3>
                        <p className="text-[#5F5F5F]">{selectedProduct.location}</p>
                      </div>
                    )}

                    {filteredTags.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#1E1E1E] mb-3">Etiquetas</h3>
                        <div className="flex flex-wrap gap-2">
                          {filteredTags.map((tag, idx) => {
                            const variants: Array<'green' | 'celeste' | 'pink'> = ['green', 'celeste', 'pink'];
                            const variant = variants[idx % variants.length];
                            return (
                              <Badge key={idx} variant={variant}>
                                {tag}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#1E1E1E] mb-3">Más imágenes</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedProduct.images.slice(1).map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`${selectedProduct.title} ${idx + 2}`}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                </div>
              )}

              {user && String(selectedProduct.user_id) !== String(user.id) && selectedProduct.status === 'active' && (
                <div className="pt-4 border-t border-gray-200">
                  {interestedListingIds.has(selectedProduct.id) ? (
                    <p className="text-center text-[#7CA982] font-semibold text-sm">✓ Ya mostraste interés</p>
                  ) : (
                    <Button
                      variant="secondary"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleMeInteresa(selectedProduct.id, selectedProduct.title, selectedProduct.description, selectedProduct.exchange_mode)}
                      disabled={!!savingInterest}
                    >
                      {savingInterest === selectedProduct.id ? 'Guardando...' : 'Me interesa'}
                    </Button>
                  )}
                </div>
              )}

              {selectedProduct.profiles?.phone_number && (
                <div className="pt-6 border-t border-gray-200">
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      window.location.href = `tel:${selectedProduct.profiles?.phone_number}`;
                    }}
                  >
                    <Phone className="w-5 h-5" />
                    Contactar: {selectedProduct.profiles.phone_number}
                  </Button>
                </div>
              )}

              {!selectedProduct.profiles?.phone_number && (
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-center text-[#8E8E8E] text-sm">
                    El vendedor no ha proporcionado un número de contacto
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
