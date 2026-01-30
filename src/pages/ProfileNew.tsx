import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useToast } from '../lib/ToastContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase, Profile } from '../lib/supabase';
import {
  Camera, Edit2, Save, X, Plus, Trash2,
  Calendar, ShoppingBag, Users, Lightbulb, MapPin, Phone, Briefcase,
  Heart, MessageCircle, ChevronRight, Settings,
  Package, Clock, Send, Sparkles, ArrowUpRight, Coffee,
  Bookmark, UserCog, Video
} from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

interface Activity {
  id: string;
  activity_id: string;
  type: 'cafecito' | 'trueque' | 'marketplace' | 'propuesta';
  title: string;
  date: string;
  description?: string;
  image_url?: string;
  created_by_me?: boolean;
}

interface CafecitoEventDetail {
  id: string;
  title: string;
  description: string;
  type: 'virtual' | 'presencial';
  event_date: string;
  event_time: string;
  location?: string | null;
  host_id?: string | null;
  host_name: string;
  host_avatar_url: string | null;
  host_bio: string | null;
  participants_count: number;
  max_participants: number;
  image_url: string;
}

interface ListingDetail {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  exchange_mode: 'barter' | 'sale';
  status?: string;
  category: string;
  price?: number;
  images: string[];
  location?: string;
  tags: string[];
  profiles?: { full_name: string; avatar_url?: string; location?: string; phone_number?: string };
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

interface Circle {
  id: string;
  name: string;
  members: number;
  image: string;
  color: string;
}

interface Exchange {
  id: string;
  title: string;
  type: 'trueque' | 'tiempo' | 'compra';
  date: string;
  image: string;
  status: 'completado' | 'pendiente' | 'en_progreso';
}

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  timestamp: string;
  viewed: boolean;
}

interface CafecitoEvent {
  id: string;
  title: string;
  description: string;
  type: 'virtual' | 'presencial';
  event_date: string;
  event_time: string;
  location?: string;
  host_id?: string;
  host_name: string;
  host_avatar_url?: string;
  host_bio?: string;
  participants_count: number;
  max_participants: number;
  image_url: string;
  created_at: string;
}

const availableInterests = [
  // Arte y Creatividad
  'Arte', 'Música', 'Fotografía', 'Literatura', 'Pintura', 'Cerámica', 'Teatro', 'Poesía', 'Diseño',
  // Bienestar y Salud
  'Yoga', 'Meditación', 'Bienestar', 'Autocuidado', 'Terapias', 'Coaching', 'Retiros', 'Mindfulness',
  // Emprendimiento y Negocios
  'Emprendimiento', 'Tecnología', 'Marketing', 'Innovación', 'Economía Circular', 'Trabajo Colaborativo',
  // Sostenibilidad y Medio Ambiente
  'Sostenibilidad', 'Medio Ambiente', 'Huertos Urbanos', 'Compostaje', 'Reciclaje', 'Consumo Consciente', 'Eco-emprendimientos',
  // Cocina y Alimentación
  'Cocina', 'Alimentación Saludable', 'Cocina Sostenible', 'Venta a Granel',
  // Comunidad y Social
  'Sororidad', 'Comunidad', 'Trueque', 'Banco de Tiempo', 'Intercambio', 'Colaboración',
  // Moda y Estilo
  'Moda Sostenible', 'Slow Fashion', 'Upcycling',
  // Otros
  'Educación', 'Mentoría', 'Networking', 'Eventos'
];

const availableSkills = [
  'Escritura', 'Maquillaje', 'Ciudad', 'Running', 'Tecnología', 'Moda',
  'Playa', 'Yoga', 'Diseño', 'Relax', 'Arte', 'Conciertos', 'Bares',
  'Fotografía', 'Cocina', 'Coaching', 'Mentoría', 'Marketing Digital',
  'Diseño Gráfico', 'Ilustración', 'Redacción', 'Traducción', 'Consultoría'
];

export default function ProfileNew() {
  const { profile, user, signOut, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [isViewingOtherUser, setIsViewingOtherUser] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [editingInfo, setEditingInfo] = useState(false);
  const [editingQuote, setEditingQuote] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activityDetail, setActivityDetail] = useState<{ type: 'cafecito'; data: CafecitoEventDetail } | { type: 'listing'; data: ListingDetail } | null>(null);
  const [activityDetailLoading, setActivityDetailLoading] = useState(false);
  const [activityDetailError, setActivityDetailError] = useState<string | null>(null);
  const [cafecitoRegistrations, setCafecitoRegistrations] = useState<{ user_id: string; full_name?: string; avatar_url?: string; phone_number?: string }[]>([]);
  const [listingInterested, setListingInterested] = useState<{ user_id: string; full_name?: string; avatar_url?: string }[]>([]);
  const [markingListingComplete, setMarkingListingComplete] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeTab, setActiveTab] = useState<'actividad' | 'intercambios' | 'marketplace'>('actividad');
  const [cafecitosTab, setCafecitosTab] = useState<'proximos' | 'pasados' | 'recomendados'>('proximos');
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [modalSelectedChat, setModalSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [customInterest, setCustomInterest] = useState('');
  const [activityFilter, setActivityFilter] = useState<'todos' | 'cafecito' | 'trueque' | 'marketplace'>('todos');
  const [activitySectionTab, setActivitySectionTab] = useState<'mis-publicaciones' | 'me-intereso'>('mis-publicaciones');
  const [interestsTab, setInterestsTab] = useState<'intereses' | 'habilidades'>('intereses');
  const [showAllTags, setShowAllTags] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectedPhoneNumber, setConnectedPhoneNumber] = useState<string>('');

  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    phone_number: '',
    profession: '',
    interests: [] as string[],
    skills: [] as string[],
    avatar_url: '',
  });

  const [dailyQuote, setDailyQuote] = useState('');
  const [tempQuote, setTempQuote] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [connections, setConnections] = useState<Profile[]>([]);
  const [viewingUserConnections, setViewingUserConnections] = useState<Profile[]>([]);

  const [stories, setStories] = useState<Story[]>([]);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [myPublications, setMyPublications] = useState<Activity[]>([]);
  const [interestedActivities, setInterestedActivities] = useState<Activity[]>([]);

  const [chats] = useState<Chat[]>([]);

  const [circles] = useState<Circle[]>([]);

  const [exchanges] = useState<Exchange[]>([]);

  const [marketplacePurchases] = useState<Exchange[]>([]);

  const [cafecitos] = useState<{
    pasados: CafecitoEvent[];
    proximos: CafecitoEvent[];
    recomendados: CafecitoEvent[];
  }>({
    pasados: [],
    proximos: [],
    recomendados: [],
  });

  const chatMessages: Record<string, Message[]> = {};

  useEffect(() => {
    // Esperar a que la autenticación termine de cargar
    if (authLoading) return;

    // Si hay un userId en la URL y es diferente al usuario actual, cargar ese perfil
    if (userId && userId !== user?.id) {
      setLoadingProfile(true);
      loadOtherUserProfile(userId);
      setIsViewingOtherUser(true);
    } else {
      setIsViewingOtherUser(false);
      setLoadingProfile(false);
      if (!user) {
        navigate('/login');
        return;
      }

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          bio: profile.bio || '',
          location: profile.location || '',
          phone_number: profile.phone_number || '',
          profession: profile.profession || '',
          interests: profile.interests || [],
          skills: profile.skills || [],
          avatar_url: profile.avatar_url || '',
        });
        setDailyQuote('');
        setTempQuote('');
      }

      // Cargar actividades, mis publicaciones y conexiones en paralelo
      Promise.all([loadActivities(), loadMyPublications(), loadConnections()]).catch((error) => {
        console.error('Error loading profile data:', error);
      });
    }
  }, [profile, user, navigate, userId, authLoading]);

  const loadConnections = async () => {
    if (!user) return;

    try {
      // Limitar a las conexiones más recientes y solo campos necesarios
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          connected_user_id,
          profiles:connected_user_id (
            id,
            full_name,
            avatar_url,
            bio,
            location,
            phone_number
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20); // Limitar a 20 conexiones más recientes

      if (error) {
        console.error('Error loading connections:', error);
        return;
      }

      if (data) {
        const connectedProfiles = data
          .map((conn: any) => conn.profiles)
          .filter((profile: Profile | null) => profile !== null) as Profile[];
        setConnections(connectedProfiles);
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const loadOtherUserConnections = async (targetUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          connected_user_id,
          profiles:connected_user_id (
            id,
            full_name,
            avatar_url,
            bio,
            location,
            phone_number
          )
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error loading other user connections:', error);
        return;
      }

      if (data) {
        const connectedProfiles = data
          .map((conn: any) => conn.profiles)
          .filter((profile: Profile | null) => profile !== null) as Profile[];
        setViewingUserConnections(connectedProfiles);
      }
    } catch (error) {
      console.error('Error loading other user connections:', error);
    }
  };

  const loadOtherUserProfile = async (targetUserId: string) => {
    try {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) {
        console.error('Error loading other user profile:', error);
        setLoadingProfile(false);
        navigate('/perfil');
        return;
      }

      if (data) {
        setViewingProfile(data);
        setFormData({
          full_name: data.full_name || '',
          bio: data.bio || '',
          location: data.location || '',
          phone_number: data.phone_number || '',
          profession: data.profession || '',
          interests: data.interests || [],
          skills: data.skills || [],
          avatar_url: data.avatar_url || '',
        });
        // Cargar actividades y conexiones del otro usuario en paralelo
        Promise.all([
          loadOtherUserActivities(targetUserId),
          loadOtherUserConnections(targetUserId)
        ]).catch((error) => {
          console.error('Error loading other user data:', error);
        });
      }
      setLoadingProfile(false);
    } catch (error) {
      console.error('Error loading other user profile:', error);
      setLoadingProfile(false);
      navigate('/perfil');
    }
  };

  const loadOtherUserActivities = async (targetUserId: string) => {
    try {
      // Solo seleccionar campos necesarios y limitar resultados
      const { data, error } = await supabase
        .from('user_activities')
        .select('id, activity_id, activity_type, title, created_at, description')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(50); // Limitar a 50 actividades más recientes

      if (error) {
        console.error('Error loading other user activities:', error);
        return;
      }

      if (data) {
        const baseActivities: Activity[] = data
          .filter((activity: any) => activity.activity_id && String(activity.activity_id).trim())
          .map((activity: any) => ({
            id: activity.id,
            activity_id: activity.activity_id,
            type: activity.activity_type === 'cafecito' ? 'cafecito' : 
                  activity.activity_type === 'trueque' ? 'trueque' :
                  activity.activity_type === 'marketplace' ? 'marketplace' : 'propuesta',
            title: activity.title,
            date: activity.created_at,
            description: activity.description || undefined,
            image_url: undefined,
          }));

        const cafecitoIds = baseActivities.filter((a) => a.type === 'cafecito').map((a) => a.activity_id);
        const listingIds = baseActivities.filter((a) => a.type === 'marketplace' || a.type === 'trueque').map((a) => a.activity_id);

        let cafecitoImages: Record<string, string> = {};
        let listingImages: Record<string, string> = {};

        if (cafecitoIds.length > 0) {
          const { data: events } = await supabase.from('cafecito_events').select('id, image_url').in('id', cafecitoIds);
          if (events) events.forEach((e: { id: string; image_url: string }) => { cafecitoImages[e.id] = e.image_url || ''; });
        }
        if (listingIds.length > 0) {
          const { data: listings } = await supabase.from('marketplace_listings').select('id, images').in('id', listingIds);
          if (listings) listings.forEach((l: { id: string; images?: string[] }) => { listingImages[l.id] = (l.images && l.images[0]) || ''; });
        }

        const formattedActivities: Activity[] = baseActivities.map((a) => ({
          ...a,
          image_url: a.type === 'cafecito' ? cafecitoImages[a.activity_id] : listingImages[a.activity_id],
        }));
        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error('Error loading other user activities:', error);
    }
  };

  const loadActivities = async () => {
    if (!user) return;

    try {
      let data: any[] | null = null;
      let error: any = null;
      let selectWithCreatedByMe = true;

      const { data: dataWithCol, error: errWith } = await supabase
        .from('user_activities')
        .select('id, activity_id, activity_type, title, created_at, description, created_by_me')
        .eq('user_id', user.id.toString())
        .order('created_at', { ascending: false })
        .limit(50);
      if (!errWith) {
        data = dataWithCol;
      } else {
        // Si la columna created_by_me no existe (migración no ejecutada), intentar sin ella
        const { data: dataWithout, error: errWithout } = await supabase
          .from('user_activities')
          .select('id, activity_id, activity_type, title, created_at, description')
          .eq('user_id', user.id.toString())
          .order('created_at', { ascending: false })
          .limit(50);
        if (!errWithout) {
          data = dataWithout;
          selectWithCreatedByMe = false;
        } else {
          error = errWith;
        }
      }

      if (error) {
        console.error('Error loading activities:', error);
        return;
      }

      if (data) {
        const baseActivities: Activity[] = data
          .filter((activity: any) => activity.activity_id && String(activity.activity_id).trim())
          .map((activity: any) => ({
            id: activity.id,
            activity_id: activity.activity_id,
            type: activity.activity_type === 'cafecito' ? 'cafecito' : 
                  activity.activity_type === 'trueque' ? 'trueque' :
                  activity.activity_type === 'marketplace' ? 'marketplace' : 'propuesta',
            title: activity.title,
            date: activity.created_at,
            description: activity.description || undefined,
            image_url: undefined,
            created_by_me: selectWithCreatedByMe ? (activity.created_by_me !== false) : true,
          }));

        // Cargar imágenes: cafecitos desde cafecito_events, marketplace/trueque desde marketplace_listings
        const cafecitoIds = baseActivities.filter((a) => a.type === 'cafecito').map((a) => a.activity_id);
        const listingIds = baseActivities.filter((a) => a.type === 'marketplace' || a.type === 'trueque').map((a) => a.activity_id);

        let cafecitoImages: Record<string, string> = {};
        let listingImages: Record<string, string> = {};

        if (cafecitoIds.length > 0) {
          const { data: events } = await supabase.from('cafecito_events').select('id, image_url').in('id', cafecitoIds);
          if (events) events.forEach((e: { id: string; image_url: string }) => { cafecitoImages[e.id] = e.image_url || ''; });
        }
        if (listingIds.length > 0) {
          const { data: listings } = await supabase.from('marketplace_listings').select('id, images').in('id', listingIds);
          if (listings) listings.forEach((l: { id: string; images?: string[] }) => { listingImages[l.id] = (l.images && l.images[0]) || ''; });
        }

        const formattedActivities: Activity[] = baseActivities.map((a) => ({
          ...a,
          image_url: a.type === 'cafecito' ? cafecitoImages[a.activity_id] : listingImages[a.activity_id],
        }));
        setActivities(formattedActivities);
        setInterestedActivities(formattedActivities.filter((a) => a.created_by_me === false));
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const loadMyPublications = async () => {
    if (!user) return;
    try {
      const items: Activity[] = [];
      const uid = user.id;
      const { data: events } = await supabase
        .from('cafecito_events')
        .select('id, title, created_at, image_url')
        .eq('host_id', uid)
        .order('created_at', { ascending: false })
        .limit(30);
      if (events) {
        events.forEach((e: { id: string; title: string; created_at: string; image_url?: string }) => {
          items.push({
            id: e.id,
            activity_id: e.id,
            type: 'cafecito',
            title: e.title,
            date: e.created_at,
            image_url: e.image_url || undefined,
            created_by_me: true,
          });
        });
      }
      const { data: listings } = await supabase
        .from('marketplace_listings')
        .select('id, title, created_at, images, exchange_mode')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(30);
      if (listings) {
        listings.forEach((l: { id: string; title: string; created_at: string; images?: string[]; exchange_mode: string }) => {
          items.push({
            id: l.id,
            activity_id: l.id,
            type: l.exchange_mode === 'barter' ? 'trueque' : 'marketplace',
            title: l.title,
            date: l.created_at,
            image_url: l.images?.[0],
            created_by_me: true,
          });
        });
      }
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMyPublications(items.slice(0, 50));
    } catch (error) {
      console.error('Error loading my publications:', error);
    }
  };

  // Cargar detalle de la actividad al hacer clic (cafecito, producto o trueque)
  useEffect(() => {
    if (!selectedActivity?.activity_id) {
      setActivityDetail(null);
      setActivityDetailError(null);
      return;
    }
    let cancelled = false;
    const activityId = selectedActivity.activity_id;
    const activityType = selectedActivity.type;

    setActivityDetailLoading(true);
    setActivityDetailError(null);
    setActivityDetail(null);

    const fetchDetail = async () => {
      try {
        if (activityType === 'cafecito') {
          const { data, error } = await supabase
            .from('cafecito_events')
            .select('*')
            .eq('id', activityId)
            .single();
          if (cancelled) return;
          if (error || !data) {
            setActivityDetailError('No se pudo cargar el cafecito');
            return;
          }
          setActivityDetail({ type: 'cafecito', data: data as CafecitoEventDetail });
        } else if (activityType === 'marketplace' || activityType === 'trueque') {
          const { data, error } = await supabase
            .from('marketplace_listings')
            .select(`
              id, user_id, title, description, exchange_mode, category, price, images, location, tags, status,
              profiles:user_id ( full_name, avatar_url, location, phone_number )
            `)
            .eq('id', activityId)
            .single();
          if (cancelled) return;
          if (error || !data) {
            setActivityDetailError('No se pudo cargar el detalle');
            return;
          }
          const row = data as any;
          setActivityDetail({
            type: 'listing',
            data: {
              id: row.id,
              user_id: row.user_id,
              title: row.title,
              description: row.description,
              exchange_mode: row.exchange_mode,
              category: row.category,
              price: row.price,
              images: row.images || [],
              location: row.location,
              tags: row.tags || [],
              status: row.status,
              profiles: row.profiles,
            },
          });
        } else {
          setActivityDetailError('Tipo de actividad no soportado');
        }
      } catch {
        if (!cancelled) setActivityDetailError('Error al cargar el detalle');
      } finally {
        if (!cancelled) setActivityDetailLoading(false);
      }
    };
    fetchDetail();
    return () => { cancelled = true; };
  }, [selectedActivity?.id, selectedActivity?.activity_id, selectedActivity?.type]);

  // Cargar inscritos (cafecito) o interesados (listing) cuando el detalle es de un item propio
  useEffect(() => {
    if (!activityDetail || !user) {
      setCafecitoRegistrations([]);
      setListingInterested([]);
      return;
    }
    const uid = user.id;
    if (activityDetail.type === 'cafecito' && activityDetail.data.host_id && String(activityDetail.data.host_id) === String(uid)) {
      supabase
        .from('cafecito_event_registrations')
        .select('user_id')
        .eq('event_id', activityDetail.data.id)
        .then(({ data: regs }) => {
          if (!regs?.length) {
            setCafecitoRegistrations([]);
            return;
          }
          const userIds = regs.map((r: { user_id: string }) => r.user_id);
          supabase.from('profiles').select('id, full_name, avatar_url, phone_number').in('id', userIds).then(({ data: profs }) => {
            setCafecitoRegistrations((profs || []).map((p: { id: string; full_name?: string; avatar_url?: string; phone_number?: string }) => ({
              user_id: p.id,
              full_name: p.full_name,
              avatar_url: p.avatar_url,
              phone_number: p.phone_number,
            })));
          });
        });
    } else if (activityDetail.type === 'listing' && activityDetail.data.user_id && String(activityDetail.data.user_id) === String(uid)) {
      supabase
        .from('marketplace_listing_interest')
        .select('user_id')
        .eq('listing_id', activityDetail.data.id)
        .then(({ data: ints }) => {
          if (!ints?.length) {
            setListingInterested([]);
            return;
          }
          const userIds = ints.map((i: { user_id: string }) => i.user_id);
          supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds).then(({ data: profs }) => {
            setListingInterested((profs || []).map((p: { id: string; full_name?: string; avatar_url?: string }) => ({
              user_id: p.id,
              full_name: p.full_name,
              avatar_url: p.avatar_url,
            })));
          });
        });
    } else {
      setCafecitoRegistrations([]);
      setListingInterested([]);
    }
  }, [activityDetail?.type, activityDetail?.data?.id, user?.id]);

  const handleMarkListingComplete = async () => {
    if (!activityDetail || activityDetail.type !== 'listing' || !activityDetail.data?.id) return;
    setMarkingListingComplete(true);
    const { error } = await supabase.from('marketplace_listings').update({ status: 'completed', updated_at: new Date().toISOString() }).eq('id', activityDetail.data.id);
    setMarkingListingComplete(false);
    if (error) {
      showToast('Error al actualizar el estado.', 'error');
      return;
    }
    showToast(activityDetail.data.exchange_mode === 'barter' ? 'Marcado como intercambiado.' : 'Marcado como comprado.', 'success');
    setActivityDetail({ ...activityDetail, data: { ...activityDetail.data, status: 'completed' } });
    loadMyPublications();
  };

  const [deletingActivity, setDeletingActivity] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const openDeleteConfirm = () => setDeleteConfirmOpen(true);
  const closeDeleteConfirm = () => setDeleteConfirmOpen(false);

  const handleConfirmDelete = async () => {
    if (!user || !activityDetail) return;
    const isCafecito = activityDetail.type === 'cafecito';
    const isListing = activityDetail.type === 'listing';
    const id = activityDetail.data?.id;
    if (!id) return;
    setDeleteConfirmOpen(false);
    setDeletingActivity(true);
    try {
      if (isCafecito) {
        const { error: evError } = await supabase.from('cafecito_events').delete().eq('id', id);
        if (evError) {
          showToast('Error al eliminar el cafecito.', 'error');
          setDeletingActivity(false);
          return;
        }
        await supabase.from('user_activities').delete().eq('user_id', user.id.toString()).eq('activity_id', id).eq('activity_type', 'cafecito');
      } else if (isListing) {
        const { error: listError } = await supabase.from('marketplace_listings').delete().eq('id', id);
        if (listError) {
          showToast('Error al eliminar la publicación.', 'error');
          setDeletingActivity(false);
          return;
        }
        await supabase.from('user_activities').delete().eq('user_id', user.id.toString()).eq('activity_id', id).in('activity_type', ['marketplace', 'trueque']);
      }
      showToast(isCafecito ? 'Cafecito eliminado.' : 'Publicación eliminada.', 'success');
      setSelectedActivity(null);
      setActivityDetail(null);
      loadMyPublications();
      loadActivities();
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar. Intenta de nuevo.', 'error');
    } finally {
      setDeletingActivity(false);
    }
  };

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona una imagen (JPG, PNG, GIF o WebP).', 'warning');
      return;
    }
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Error subiendo imagen:', uploadError);
        showToast(`Error al subir la imagen: ${uploadError.message}`, 'error');
        return;
      }

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      if (urlData?.publicUrl) {
        setFormData((prev) => ({ ...prev, avatar_url: urlData.publicUrl }));
      }
    } catch (err) {
      console.error('Error al procesar la imagen:', err);
      showToast('Error al subir la imagen. Intenta de nuevo.', 'error');
    }
    e.target.value = '';
  };

  const handleSaveInfo = async () => {
    if (!profile || !user) return;

    const basePayload = {
      full_name: formData.full_name,
      bio: formData.bio || null,
      location: formData.location || null,
      interests: formData.interests,
      skills: formData.skills,
      avatar_url: formData.avatar_url || null,
      updated_at: new Date().toISOString(),
    };

    const payloadWithExtra = {
      ...basePayload,
      phone_number: formData.phone_number?.trim() || null,
      profession: formData.profession?.trim() || null,
    };

    try {
      let { error } = await supabase
        .from('profiles')
        .update(payloadWithExtra)
        .eq('id', user.id);

      // Si falla por columna inexistente (migración no ejecutada), reintentar sin phone_number y profession
      if (error && (error.message?.includes('column') || error.code === '42703')) {
        const { error: retryError } = await supabase
          .from('profiles')
          .update(basePayload)
          .eq('id', user.id);
        if (retryError) throw retryError;
      } else if (error) {
        throw error;
      }

      setEditingInfo(false);
      window.location.reload();
    } catch (error: unknown) {
      console.error('Error al guardar perfil:', error);
      const msg = error && typeof error === 'object' && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Error desconocido';
      showToast(`Error al guardar los cambios. ${msg}`, 'error');
    }
  };

  const handleSaveQuote = () => {
    setDailyQuote(tempQuote);
    setEditingQuote(false);
  };

  const handleAddImage = () => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop',
      caption: 'Nueva imagen',
    };
    setGallery([...gallery, newImage]);
  };

  const handleDeleteImage = (id: string) => {
    setGallery(gallery.filter(img => img.id !== id));
  };

  const handleAddStory = () => {
    const newStory: Story = {
      id: Date.now().toString(),
      userId: 'me',
      userName: 'Mi Historia',
      userAvatar: formData.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=1200&fit=crop',
      timestamp: 'Ahora',
      viewed: false,
    };
    setStories([newStory, ...stories]);
  };

  const handleViewStory = (story: Story) => {
    setSelectedStory(story);
    const updatedStories = stories.map(s =>
      s.id === story.id ? { ...s, viewed: true } : s
    );
    setStories(updatedStories);
  };

  const persistInterests = async (newInterests: string[]) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ interests: newInterests, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) {
      console.error('Error guardando intereses:', error);
      showToast('No se pudieron guardar los intereses. Intenta de nuevo.', 'error');
    }
  };

  const toggleInterest = async (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    setFormData({ ...formData, interests: newInterests });
    await persistInterests(newInterests);
  };

  const handleAddCustomInterest = async () => {
    const trimmed = customInterest.trim();
    if (!trimmed || formData.interests.includes(trimmed)) return;
    const newInterests = [...formData.interests, trimmed];
    setFormData({ ...formData, interests: newInterests });
    setCustomInterest('');
    await persistInterests(newInterests);
  };

  const handleRemoveInterest = async (interest: string) => {
    const newInterests = formData.interests.filter(i => i !== interest);
    setFormData({ ...formData, interests: newInterests });
    await persistInterests(newInterests);
  };

  const persistSkills = async (newSkills: string[]) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ skills: newSkills, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) {
      console.error('Error guardando habilidades:', error);
      showToast('No se pudieron guardar las habilidades. Intenta de nuevo.', 'error');
    }
  };

  const toggleSkill = async (skill: string) => {
    const newSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    setFormData({ ...formData, skills: newSkills });
    await persistSkills(newSkills);
  };

  const handleAddCustomSkill = async () => {
    const trimmed = customInterest.trim();
    if (!trimmed || formData.skills.includes(trimmed)) return;
    const newSkills = [...formData.skills, trimmed];
    setFormData({ ...formData, skills: newSkills });
    setCustomInterest('');
    await persistSkills(newSkills);
  };

  const handleRemoveSkill = async (skill: string) => {
    const newSkills = formData.skills.filter(s => s !== skill);
    setFormData({ ...formData, skills: newSkills });
    await persistSkills(newSkills);
  };

  const handleConnect = async () => {
    if (!user || !viewingProfile) return;

    try {
      // Guardar la conexión en la base de datos
      const { error: connectionError } = await supabase
        .from('user_connections')
        .insert({
          user_id: user.id,
          connected_user_id: viewingProfile.id,
        });

      if (connectionError) {
        // Si ya existe la conexión, no es un error crítico
        if (connectionError.code !== '23505') {
          console.error('Error creating connection:', connectionError);
          showToast('Error al crear la conexión. Intenta de nuevo.', 'error');
          return;
        }
      }

      // Recargar conexiones
      await loadConnections();

      // Mostrar el modal con el número de teléfono
      setConnectedPhoneNumber(viewingProfile.phone_number || 'No disponible');
      setShowConnectModal(true);
    } catch (error) {
      console.error('Error connecting user:', error);
      showToast('Error al conectar. Intenta de nuevo.', 'error');
    }
  };

  const handleCopyPhoneNumber = () => {
    if (connectedPhoneNumber && connectedPhoneNumber !== 'No disponible') {
      navigator.clipboard.writeText(connectedPhoneNumber);
      showToast('Número copiado al portapapeles', 'success');
    }
  };

  const getTagColor = (tag: string, index: number) => {
    // Colores según la referencia visual
    const colorMap: Record<string, string> = {
      'Escritura': 'bg-orange-500',
      'Maquillaje': 'bg-orange-500',
      'Ciudad': 'bg-yellow-400',
      'Running': 'bg-yellow-400',
      'Tecnología': 'bg-yellow-400',
      'Moda': 'bg-yellow-400',
      'Playa': 'bg-purple-300',
      'Yoga': 'bg-purple-300',
      'Diseño': 'bg-purple-300',
      'Relax': 'bg-red-800',
      'Arte': 'bg-red-800',
      'Conciertos': 'bg-orange-600',
      'Bares': 'bg-orange-600',
    };
    
    if (colorMap[tag]) {
      return colorMap[tag];
    }
    
    // Colores por defecto rotando
    const defaultColors = [
      'bg-orange-500', 'bg-yellow-400', 'bg-purple-300', 'bg-red-800',
      'bg-orange-600', 'bg-yellow-500'
    ];
    return defaultColors[index % defaultColors.length];
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'cafecito': return <Coffee className="w-5 h-5" />;
      case 'trueque': return <ShoppingBag className="w-5 h-5" />;
      case 'marketplace': return <Package className="w-5 h-5" />;
      case 'propuesta': return <Lightbulb className="w-5 h-5" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'cafecito': return 'bg-[#E6A5A1]';
      case 'trueque': return 'bg-[#CF3F7A]';
      case 'marketplace': return 'bg-[#2D5444]';
      case 'propuesta': return 'bg-[#7CA982]';
      default: return 'bg-gray-500';
    }
  };

  const getActivityBorderColor = (type: string) => {
    switch (type) {
      case 'cafecito': return 'border-[#E6A5A1]';
      case 'trueque': return 'border-[#CF3F7A]';
      case 'marketplace': return 'border-[#2D5444]';
      case 'propuesta': return 'border-[#7CA982]';
      default: return 'border-gray-500';
    }
  };

  const getActivityTextColor = (type: string) => {
    switch (type) {
      case 'cafecito': return 'text-[#E6A5A1]';
      case 'trueque': return 'text-[#CF3F7A]';
      case 'marketplace': return 'text-[#2D5444]';
      case 'propuesta': return 'text-[#7CA982]';
      default: return 'text-gray-500';
    }
  };

  const getTabColor = (tab: string) => {
    switch (tab) {
      case 'actividad': return 'bg-[#CF3F7A]';
      case 'circulos': return 'bg-[#7CA982]';
      case 'intercambios': return 'bg-[#E6A5A1]';
      case 'marketplace': return 'bg-[#2D5444]';
      default: return 'bg-[#CF3F7A]';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completado': return 'bg-[#7CA982]';
      case 'pendiente': return 'bg-[#E6A5A1]';
      case 'en_progreso': return 'bg-[#CF3F7A]';
      default: return 'bg-gray-500';
    }
  };

  // Determinar qué perfil usar
  const currentProfile = isViewingOtherUser ? viewingProfile : profile;

  // Mostrar estado de carga
  if (authLoading || loadingProfile || (!currentProfile && user && !isViewingOtherUser)) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#CF3F7A] border-t-transparent mb-4" />
          <p className="text-[#6E6E6E]">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Si está viendo otro usuario y no está logueado, redirigir a login
  if (isViewingOtherUser && !user) {
    navigate('/login');
    return null;
  }

  // Si no hay perfil y no hay usuario, redirigir a login
  if (!currentProfile && !user) {
    navigate('/login');
    return null;
  }

  // Vista simplificada cuando se está viendo otro usuario
  if (isViewingOtherUser && viewingProfile) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          {/* Botón de volver */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-[#2D5444] hover:text-[#CF3F7A] transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Volver
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SIDEBAR IZQUIERDO - PERFIL */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card de perfil principal */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white">
                <div className="relative">
                  {/* Banner con imagen estándar */}
                  <div className="h-32 relative">
                    <img
                      src="/hero-conexion.jpg"
                      alt="Banner"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=400&fit=crop';
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white p-1 shadow-xl">
                      {viewingProfile.avatar_url ? (
                        <img
                          src={viewingProfile.avatar_url}
                          alt={viewingProfile.full_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-[#2D5444] flex items-center justify-center text-white text-4xl font-bold">
                          {viewingProfile.full_name[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información del perfil */}
                <div className="pt-20 px-6 pb-6 text-center">
                  <h1 className="text-3xl font-bold text-[#2D5444] mb-2">
                    {viewingProfile.full_name}
                  </h1>
                  {viewingProfile.bio && (
                    <p className="text-[#6E6E6E] text-sm leading-relaxed mb-4">{viewingProfile.bio}</p>
                  )}
                  {viewingProfile.location && (
                    <div className="flex items-center justify-center gap-2 text-[#6E6E6E] text-sm mb-4">
                      <MapPin className="w-4 h-4 text-[#CF3F7A]" />
                      <span>{viewingProfile.location}</span>
                    </div>
                  )}

                  {/* Botón Conectar */}
                  <Button
                    variant="primary"
                    className="w-full bg-[#2D5444] hover:bg-[#2D5444]/90 text-white rounded-full py-3 mb-6"
                    onClick={handleConnect}
                  >
                    Conectar
                  </Button>
                </div>
              </div>

              {/* Intereses y Habilidades */}
              {(viewingProfile.interests.length > 0 || viewingProfile.skills.length > 0) && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white">
                  <h2 className="text-2xl font-bold text-[#2D5444] mb-4">
                    Intereses y Habilidades
                  </h2>
                  
                  {viewingProfile.interests.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-[#2D5444] mb-2 uppercase tracking-wide">Intereses</h3>
                      <div className="flex flex-wrap gap-2">
                        {viewingProfile.interests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2D5444] text-white"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewingProfile.skills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-[#2D5444] mb-2 uppercase tracking-wide">Habilidades</h3>
                      <div className="flex flex-wrap gap-2">
                        {viewingProfile.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#CF3F7A] text-white"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="lg:col-span-8 space-y-6">
              {/* Conexiones */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white">
                <h2 className="text-2xl font-bold text-[#2D5444] mb-6">
                  Conexiones
                </h2>

                {viewingUserConnections.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {viewingUserConnections.map((connection) => (
                      <div
                        key={connection.id}
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={() => navigate(`/perfil/${connection.id}`)}
                      >
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shadow-md mb-2 group-hover:scale-110 transition-transform duration-300">
                          {connection.avatar_url ? (
                            <img
                              src={connection.avatar_url}
                              alt={connection.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#2D5444] flex items-center justify-center text-white text-2xl font-bold">
                              {connection.full_name[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-[#2D5444] text-center truncate w-full">
                          {connection.full_name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#6E6E6E]">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Aún no tiene conexiones</p>
                    <p className="text-sm mt-2">Las conexiones con otras mujeres Beginss aparecerán aquí</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de conexión con número de teléfono */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#2D5444] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#2D5444] mb-2">
                  ¡Conexión exitosa!
                </h2>
                <p className="text-[#6E6E6E] mb-6">
                  Número de contacto de {viewingProfile.full_name}
                </p>
                <div className="bg-[#F7EFE9] rounded-full p-4 mb-6">
                  <p className="text-xl font-semibold text-[#2D5444]">
                    {connectedPhoneNumber}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    className="flex-1 bg-[#2D5444] hover:bg-[#2D5444]/90 text-white rounded-full py-3"
                    onClick={handleCopyPhoneNumber}
                    disabled={connectedPhoneNumber === 'No disponible'}
                  >
                    Copiar número
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#2D5444] rounded-full py-3"
                    onClick={() => setShowConnectModal(false)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* SIDEBAR IZQUIERDO - PERFIL */}
          <div className="lg:col-span-4 space-y-6">

            {/* CARD DE PERFIL PRINCIPAL */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white">
              <div className="relative">
                {/* Banner con imagen */}
                <div className="h-32 relative">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=400&fit=crop"
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2D5444]/40" />
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {formData.avatar_url ? (
                      <img
                        src={formData.avatar_url}
                        alt={formData.full_name}
                        className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white bg-[#CF3F7A] flex items-center justify-center shadow-xl">
                        <span className="text-5xl font-bold text-white">
                          {formData.full_name[0]?.toUpperCase() || 'B'}
                        </span>
                      </div>
                    )}
                    {editingInfo && !isViewingOtherUser && (
                      <>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute bottom-2 right-2 bg-white text-[#CF3F7A] p-2 rounded-full shadow-lg hover:bg-gray-50 transition-all"
                          title="Cargar imagen"
                        >
                          <Camera className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-20 px-6 pb-6 text-center">
                {(!editingInfo || isViewingOtherUser) ? (
                  <>
                    <h1 className="text-3xl font-bold text-[#2D5444] mb-2">
                      {formData.full_name}
                    </h1>
                    {formData.bio && (
                      <p className="text-[#6E6E6E] text-sm leading-relaxed mb-4">{formData.bio}</p>
                    )}
                    {formData.location && (
                      <div className="flex items-center justify-center gap-2 text-[#6E6E6E] text-sm mb-2">
                        <MapPin className="w-4 h-4 text-[#CF3F7A]" />
                        <span>{formData.location}</span>
                      </div>
                    )}
                    {formData.phone_number && (
                      <div className="flex items-center justify-center gap-2 text-[#6E6E6E] text-sm mb-2">
                        <Phone className="w-4 h-4 text-[#CF3F7A]" />
                        <span>{formData.phone_number}</span>
                      </div>
                    )}
                    {formData.profession && (
                      <div className="flex items-center justify-center gap-2 text-[#6E6E6E] text-sm mb-4">
                        <Briefcase className="w-4 h-4 text-[#CF3F7A]" />
                        <span>{formData.profession}</span>
                      </div>
                    )}
                    {!formData.location && !formData.phone_number && !formData.profession && <div className="mb-4" />}

                    {formData.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {formData.interests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2D5444] text-white"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}

                    {!isViewingOtherUser && !editingInfo && (
                      <button
                        onClick={() => setEditingInfo(true)}
                        className="w-full py-3 bg-[#2D5444] text-white rounded-full font-semibold hover:bg-[#2D5444]/90 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar Perfil
                      </button>
                    )}
                  </>
                ) : !isViewingOtherUser ? (
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-semibold text-[#2D5444] mb-2 uppercase tracking-wide">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#CF3F7A] focus:ring-2 focus:ring-[#CF3F7A]/20 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D5444] mb-2 uppercase tracking-wide">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#CF3F7A] focus:ring-2 focus:ring-[#CF3F7A]/20 outline-none resize-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D5444] mb-2 uppercase tracking-wide">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#CF3F7A] focus:ring-2 focus:ring-[#CF3F7A]/20 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D5444] mb-2 uppercase tracking-wide">
                        Número de teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        placeholder="Ej: +57 300 123 4567"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#CF3F7A] focus:ring-2 focus:ring-[#CF3F7A]/20 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D5444] mb-2 uppercase tracking-wide">
                        Profesión
                      </label>
                      <input
                        type="text"
                        value={formData.profession}
                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                        placeholder="Ej: Diseñadora, Psicóloga, Emprendedora"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#CF3F7A] focus:ring-2 focus:ring-[#CF3F7A]/20 outline-none text-sm"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveInfo}
                        className="flex-1 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all text-sm"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingInfo(false)}
                        className="flex-1 py-2 bg-gray-100 text-[#6E6E6E] rounded-full font-semibold hover:bg-gray-200 transition-all text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* AJUSTES */}
            {!isViewingOtherUser && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white">
                <h2 className="text-2xl font-bold text-[#2D5444] mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-[#CF3F7A]" />
                  Ajustes de Cuenta
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setEditingInfo(true)}
                    className="px-4 py-3 rounded-full border-2 border-gray-200 hover:border-[#7CA982] hover:bg-[#7CA982]/5 transition-all flex items-center justify-center gap-2 font-semibold text-[#2D5444] text-sm"
                  >
                    <Edit2 className="w-5 h-5" />
                    Editar perfil
                  </button>
                  <button
                    onClick={() => setEditingQuote(true)}
                    className="px-4 py-3 rounded-full border-2 border-gray-200 hover:border-[#CF3F7A] hover:bg-[#CF3F7A]/5 transition-all flex items-center justify-center gap-2 font-semibold text-[#2D5444] text-sm"
                  >
                    <Sparkles className="w-5 h-5" />
                    Cambiar frase
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-full border-2 border-red-200 hover:border-red-400 hover:bg-red-50 transition-all text-red-600 font-semibold flex items-center justify-center gap-2 text-sm"
                  >
                    <X className="w-5 h-5" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}

            {/* FRASE DEL DÍA */}
            <div className="bg-gradient-to-br from-[#CF3F7A] to-[#E6A5A1] rounded-2xl p-6 shadow-lg border border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop')] bg-cover bg-center" />
              </div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-white" />
                    <h3 className="font-bold text-white">Frase del día</h3>
                  </div>
                  {!editingQuote ? (
                    <button
                      onClick={() => setEditingQuote(true)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveQuote}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {!editingQuote ? (
                  <p className="text-white font-medium leading-relaxed italic text-lg">
                    "{dailyQuote}"
                  </p>
                ) : (
                  <textarea
                    rows={3}
                    value={tempQuote}
                    onChange={(e) => setTempQuote(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-white/50 focus:border-white outline-none resize-none bg-white/20 text-white placeholder-white/60 text-sm"
                    placeholder="Escribe tu frase del día..."
                  />
                )}
              </div>
            </div>

            {/* CHATS - oculto */}
            <div className="hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#2D5444] flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#CF3F7A]" />
                  Conversaciones
                </h3>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {chats.slice(0, 4).map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#fef4ef] transition-all cursor-pointer"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.unread > 0 && (
                        <div className="absolute -top-1 -right-1 bg-[#CF3F7A] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#2D5444] text-sm truncate">{chat.name}</h4>
                      <p className="text-xs text-[#6E6E6E] truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowMessagingModal(true)}
                className="mt-4 w-full py-2 bg-[#2D5444] text-white rounded-full font-semibold hover:bg-[#2D5444]/90 transition-all text-sm"
              >
                Ver todos los chats
              </button>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="lg:col-span-8 space-y-6">

            {/* CONTENIDO DE ACTIVIDAD */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white min-h-[500px]">
              <div>
                <h3 className="text-2xl font-bold text-[#2D5444] mb-6">
                  Tu Actividad Reciente
                </h3>

                {!isViewingOtherUser && (
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setActivitySectionTab('mis-publicaciones')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 border ${
                        activitySectionTab === 'mis-publicaciones'
                          ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                          : 'bg-white text-[#6E6E6E] border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Package className="w-3 h-3" />
                      Mis publicaciones
                      {myPublications.length > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${activitySectionTab === 'mis-publicaciones' ? 'bg-white/20' : 'bg-gray-200'}`}>
                          {myPublications.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActivitySectionTab('me-intereso')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 border ${
                        activitySectionTab === 'me-intereso'
                          ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                          : 'bg-white text-[#6E6E6E] border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      Me interesó
                      {interestedActivities.length > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${activitySectionTab === 'me-intereso' ? 'bg-white/20' : 'bg-gray-200'}`}>
                          {interestedActivities.length}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* Filtros por tipo (Todos, Cafecito, Trueque, Marketplace) */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setActivityFilter('todos')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      activityFilter === 'todos' ? 'bg-[#2D5444] text-white' : 'bg-gray-100 text-[#6E6E6E] hover:bg-gray-200'
                    }`}
                  >
                    Todos
                  </button>
                  <button onClick={() => setActivityFilter('cafecito')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${activityFilter === 'cafecito' ? 'bg-[#E6A5A1] text-white' : 'bg-gray-100 text-[#6E6E6E] hover:bg-gray-200'}`}>
                    <Coffee className="w-4 h-4" /> Cafecito
                  </button>
                  <button onClick={() => setActivityFilter('trueque')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${activityFilter === 'trueque' ? 'bg-[#CF3F7A] text-white' : 'bg-gray-100 text-[#6E6E6E] hover:bg-gray-200'}`}>
                    <ShoppingBag className="w-4 h-4" /> Trueque
                  </button>
                  <button onClick={() => setActivityFilter('marketplace')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${activityFilter === 'marketplace' ? 'bg-[#2D5444] text-white' : 'bg-gray-100 text-[#6E6E6E] hover:bg-gray-200'}`}>
                    <Package className="w-4 h-4" /> Marketplace
                  </button>
                </div>

                {(() => {
                  const filterFn = (a: Activity) => activityFilter === 'todos' || a.type === activityFilter;
                  const renderCard = (activity: Activity) => (
                    <div key={activity.id} onClick={() => setSelectedActivity(activity)} className="p-5 rounded-xl transition-all cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {activity.image_url ? <img src={activity.image_url} alt={activity.title} className="w-full h-full object-cover" /> : <span className="text-gray-400">{getActivityIcon(activity.type)}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-[#1E1E1E] truncate">{activity.title}</h4>
                            {activity.type === 'cafecito' && <span className="px-2 py-0.5 bg-[#E6A5A1]/20 text-[#E6A5A1] text-xs font-semibold rounded-full shrink-0">Cafecito</span>}
                            {activity.type === 'marketplace' && <span className="px-2 py-0.5 bg-[#2D5444]/20 text-[#2D5444] text-xs font-semibold rounded-full shrink-0">Marketplace</span>}
                            {activity.type === 'trueque' && <span className="px-2 py-0.5 bg-[#CF3F7A]/20 text-[#CF3F7A] text-xs font-semibold rounded-full shrink-0">Trueque</span>}
                          </div>
                          <p className="text-sm text-[#6E6E6E]">{new Date(activity.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-[#6E6E6E] shrink-0" />
                      </div>
                    </div>
                  );
                  if (isViewingOtherUser) {
                    const filtered = activities.filter(filterFn);
                    return filtered.length > 0 ? (
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto">{filtered.map(renderCard)}</div>
                    ) : (
                      <p className="text-sm text-[#8E8E8E] py-4">Sin actividad reciente.</p>
                    );
                  }
                  const list = activitySectionTab === 'mis-publicaciones' ? myPublications : interestedActivities;
                  const filtered = list.filter(filterFn);
                  const emptyMsg = activitySectionTab === 'mis-publicaciones'
                    ? 'Aún no has publicado cafecitos, productos ni trueques.'
                    : 'No hay publicaciones de otros que hayas guardado aquí.';
                  return filtered.length > 0 ? (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">{filtered.map(renderCard)}</div>
                  ) : (
                    <p className="text-sm text-[#8E8E8E] py-4">{emptyMsg}</p>
                  );
                })()}
              </div>
            </div>

            {/* INTERESES Y ETIQUETAS */}
            <div className="bg-gray-50 rounded-2xl shadow-lg p-8 border border-gray-200">
                <div>
                  <h2 className="text-3xl font-bold text-[#1E1E1E] mb-2">
                    Intereses y etiquetas
                  </h2>
                  <p className="text-base text-[#1E1E1E] mb-6">
                    Edita tus etiquetas para añadir intereses o habilidades que harán identificar mejor contenido.
                  </p>

                  {/* Toggle Buttons */}
                  <div className="flex gap-3 mb-8">
                    <button
                      onClick={() => setInterestsTab('intereses')}
                      className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 border ${
                        interestsTab === 'intereses'
                          ? 'bg-[#1E1E1E] text-white border-[#1E1E1E] shadow-md'
                          : 'bg-white text-[#6E6E6E] border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                      Etiquetas de intereses
                    </button>
                    <button
                      onClick={() => setInterestsTab('habilidades')}
                      className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 border ${
                        interestsTab === 'habilidades'
                          ? 'bg-[#1E1E1E] text-white border-[#1E1E1E] shadow-md'
                          : 'bg-white text-[#6E6E6E] border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <UserCog className="w-4 h-4" />
                      Etiquetas de habilidades
                    </button>
                  </div>

                  {/* Etiquetas seleccionadas - Esta es la sección principal */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-[#2D5444] mb-3 uppercase tracking-wide">
                      {interestsTab === 'intereses' ? 'Intereses' : 'Habilidades'} seleccionados ({(interestsTab === 'intereses' ? formData.interests : formData.skills).length})
                    </h3>
                    {(interestsTab === 'intereses' ? formData.interests : formData.skills).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(interestsTab === 'intereses' ? formData.interests : formData.skills).map((item, idx) => (
                          <span
                            key={idx}
                            className={`px-4 py-2 rounded-full text-sm font-semibold text-white flex items-center gap-2 cursor-default select-none ${getTagColor(item, idx)}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <span className="pointer-events-none">{item}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                interestsTab === 'intereses' ? handleRemoveInterest(item) : handleRemoveSkill(item);
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
                              className="hover:bg-white/20 rounded-full p-0.5 transition-all flex items-center justify-center ml-1 pointer-events-auto"
                              aria-label={`Eliminar ${item}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#6E6E6E] italic">
                        Aún no has agregado {interestsTab === 'intereses' ? 'intereses' : 'habilidades'}. Usa el campo de texto abajo para agregarlos.
                      </p>
                    )}
                  </div>

                  {/* Agregar etiquetas nuevas */}
                  <div>
                    <h3 className="text-lg font-bold text-[#1E1E1E] mb-4">
                      Agrega etiquetas nuevas
                    </h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={customInterest}
                        onChange={(e) => setCustomInterest(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (interestsTab === 'intereses') {
                              handleAddCustomInterest();
                            } else {
                              handleAddCustomSkill();
                            }
                          }
                        }}
                        placeholder="Escribe etiquetas separadas por comas..."
                        className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#2D5444] focus:ring-2 focus:ring-[#2D5444]/20 outline-none transition-all text-base"
                      />
                      <button
                        type="button"
                        onClick={() => interestsTab === 'intereses' ? handleAddCustomInterest() : handleAddCustomSkill()}
                        disabled={!customInterest.trim()}
                        className="px-6 py-3 bg-[#2D5444] text-white rounded-full font-semibold hover:bg-[#2D5444]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Agregar
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            {/* CONEXIONES */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2D5444]">
                  Conexiones
                </h2>
              </div>

              {connections.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {connections.map((connection) => (
                    <div
                      key={connection.id}
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => navigate(`/perfil/${connection.id}`)}
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shadow-md mb-2 group-hover:scale-110 transition-transform duration-300">
                        {connection.avatar_url ? (
                          <img
                            src={connection.avatar_url}
                            alt={connection.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#2D5444] flex items-center justify-center text-white text-2xl font-bold">
                            {connection.full_name[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[#2D5444] text-center truncate w-full">
                        {connection.full_name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#6E6E6E]">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Aún no tienes conexiones</p>
                  <p className="text-sm mt-2">Tus conexiones con otras mujeres Beginss aparecerán aquí</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALES */}
      {/* Modal de Mensajería */}
      {showMessagingModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white p-6 flex items-center justify-between border-b border-gray-200">
              <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-[#CF3F7A]" />
                Mensajería
              </h2>
              <button
                onClick={() => {
                  setShowMessagingModal(false);
                  setModalSelectedChat(null);
                }}
                className="text-black hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido Principal */}
            <div className="flex flex-1 overflow-hidden">
              {/* Lista de Chats */}
              <div className={`${modalSelectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 border-r border-gray-200 bg-gray-50`}>
                <div className="p-4 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Buscar conversaciones..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#CF3F7A] focus:ring-2 focus:ring-[#CF3F7A]/20 outline-none text-sm"
                  />
                </div>
                <div className="flex-1 overflow-y-auto">
                  {chats.length > 0 ? (
                    chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setModalSelectedChat(chat)}
                        className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-b border-gray-100 ${
                          modalSelectedChat?.id === chat.id
                            ? 'bg-[#CF3F7A]/10 border-l-4 border-l-[#CF3F7A]'
                            : 'hover:bg-white'
                        }`}
                      >
                      <div className="relative flex-shrink-0">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        {chat.unread > 0 && (
                          <div className="absolute -top-1 -right-1 bg-[#CF3F7A] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                            {chat.unread}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-[#2D5444] text-sm truncate">
                            {chat.name}
                          </h4>
                          <span className="text-xs text-[#6E6E6E]">{chat.time}</span>
                        </div>
                        <p className="text-xs text-[#6E6E6E] truncate">{chat.lastMessage}</p>
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-[#6E6E6E] text-center px-4">
                      <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-lg">No tienes conversaciones</p>
                      <p className="text-sm mt-2 text-center">Comienza a interactuar con la comunidad para ver tus mensajes aquí</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Área de Conversación */}
              <div className={`${modalSelectedChat ? 'flex' : 'hidden md:flex'} flex-col flex-1 bg-white`}>
                {modalSelectedChat ? (
                  <>
                    {/* Header del Chat */}
                    <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
                      <button
                        onClick={() => setModalSelectedChat(null)}
                        className="md:hidden text-[#2D5444] hover:bg-gray-100 p-2 rounded-full"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                      </button>
                      <img
                        src={modalSelectedChat.avatar}
                        alt={modalSelectedChat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-[#2D5444]">{modalSelectedChat.name}</h3>
                        <p className="text-xs text-[#6E6E6E]">En línea</p>
                      </div>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                      {chatMessages[modalSelectedChat.id]?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                              message.sender === 'me'
                                ? 'bg-[#CF3F7A] text-white rounded-br-sm'
                                : 'bg-white text-[#2D5444] border border-gray-200 rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <span
                              className={`text-xs mt-1 block ${
                                message.sender === 'me' ? 'text-white/80' : 'text-[#6E6E6E]'
                              }`}
                            >
                              {message.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input de Mensaje */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Escribe un mensaje..."
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CF3F7A] focus:ring-2 focus:ring-[#CF3F7A]/20 outline-none text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && newMessage.trim()) {
                              setNewMessage('');
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (newMessage.trim()) {
                              setNewMessage('');
                            }
                          }}
                          className="bg-[#CF3F7A] text-white p-3 rounded-xl hover:bg-[#CF3F7A]/90 transition-all"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center p-8">
                    <div>
                      <MessageCircle className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-[#2D5444] mb-2">
                        Selecciona una conversación
                      </h3>
                      <p className="text-[#6E6E6E]">
                        Elige un chat de la lista para ver los mensajes
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Imagen */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-16 right-0 text-white hover:text-gray-300 transition-colors bg-white/10 p-3 rounded-full"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Imagen ampliada"
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Modal de Historia */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() => setSelectedStory(null)}
        >
          <div className="relative max-w-md w-full h-[600px]" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStory.userAvatar}
                  alt={selectedStory.userName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{selectedStory.userName}</p>
                  <p className="text-white/80 text-xs">{selectedStory.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <img
              src={selectedStory.image}
              alt="Historia"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Modal de detalle de Actividad (cafecito, producto o trueque) */}
      {selectedActivity && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => { setSelectedActivity(null); setActivityDetail(null); setActivityDetailError(null); }}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <div className={`p-2 rounded-xl ${getActivityColor(selectedActivity.type)} text-white inline-flex`}>
                {getActivityIcon(selectedActivity.type)}
              </div>
              <button
                onClick={() => { setSelectedActivity(null); setActivityDetail(null); setActivityDetailError(null); }}
                className="text-[#6E6E6E] hover:text-[#2D5444] transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {activityDetailLoading && (
                <div className="py-12 text-center text-[#6E6E6E]">
                  <Clock className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                  <p>Cargando detalle...</p>
                </div>
              )}
              {activityDetailError && !activityDetailLoading && (
                <div className="py-8 text-center">
                  <p className="text-[#6E6E6E] mb-4">{activityDetailError}</p>
                  <Button variant="secondary" onClick={() => { setSelectedActivity(null); setActivityDetailError(null); }}>
                    Cerrar
                  </Button>
                </div>
              )}
              {activityDetail && activityDetail.type === 'cafecito' && activityDetail.data && (() => {
                const rawDesc = activityDetail.data.description || '';
                const categoryMatch = rawDesc.match(/\[Categoría:\s*([^\]]+)\]/i);
                const categoryValue = categoryMatch ? categoryMatch[1].trim() : '';
                const tagsMatch = rawDesc.match(/Etiquetas:\s*([^\n]+)/i);
                const tagsList = tagsMatch ? tagsMatch[1].split(',').map((t: string) => t.trim()).filter(Boolean) : [];
                let cleanDesc = rawDesc
                  .replace(/\[Categoría:\s*[^\]]+\]\s*\n?\n?/gi, '')
                  .replace(/\n?\n?Etiquetas:\s*[^\n]+/gi, '')
                  .trim();
                return (
                <>
                  {/* Imagen reducida */}
                  <div className="relative rounded-xl overflow-hidden mb-4 w-full shrink-0" style={{ height: '10rem' }}>
                    <img
                      src={activityDetail.data.image_url}
                      alt={activityDetail.data.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    {activityDetail.data.host_avatar_url ? (
                      <img src={activityDetail.data.host_avatar_url} alt={activityDetail.data.host_name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#7CA982]/30 flex items-center justify-center">
                        <span className="text-lg font-semibold text-[#2D5444]">{activityDetail.data.host_name[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[#1E1E1E]">{activityDetail.data.host_name}</p>
                      {activityDetail.data.host_bio && <p className="text-sm text-[#6E6E6E]">{activityDetail.data.host_bio}</p>}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2D5444] mb-3">{activityDetail.data.title}</h3>

                  {/* Categoría: arriba de Descripción, bold naranja, sin corchetes */}
                  {categoryValue && (
                    <div className="mb-3">
                      <span className="text-sm text-[#6E6E6E]">Categoría: </span>
                      <span className="font-bold text-[#F97316]">{categoryValue}</span>
                    </div>
                  )}

                  {/* Descripción: título fijo y texto limpio (sin [Categoría...] ni Etiquetas:...) */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#1E1E1E] mb-1">Descripción</h4>
                    <p className="text-[#5F5F5F] leading-relaxed whitespace-pre-wrap">{cleanDesc || '—'}</p>
                  </div>

                  {/* Etiquetas: solo pills redondeados, sin la palabra "Etiquetas" */}
                  {tagsList.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tagsList.map((tag: string, idx: number) => {
                        const tagStyles = ['bg-[#7CA982]/15 text-[#3E6049]', 'bg-[#CDE6E0] text-[#3E6049]', 'bg-[#e74865]/15 text-[#5F5F5F]'];
                        return (
                          <span key={idx} className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${tagStyles[idx % 3]}`}>
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-2 mb-4 text-[#5F5F5F]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#F5C542]" />
                      <span>{new Date(activityDetail.data.event_date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {String(activityDetail.data.event_time).slice(0, 5)}</span>
                    </div>
                    {activityDetail.data.type === 'virtual' ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Video className="w-5 h-5 text-[#b2d9d9] shrink-0" />
                          <span>Encuentro virtual</span>
                        </div>
                        {activityDetail.data.location && (
                          <a
                            href={activityDetail.data.location.startsWith('http') ? activityDetail.data.location : `https://${activityDetail.data.location}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#7CA982] font-medium underline hover:text-[#2D5444] break-all"
                          >
                            Ir al evento en línea →
                          </a>
                        )}
                      </div>
                    ) : (
                      activityDetail.data.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#cf3f5c]" />
                          <span>{activityDetail.data.location}</span>
                        </div>
                      )
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#2D5444]" />
                      <span>{activityDetail.data.participants_count}/{activityDetail.data.max_participants} participantes</span>
                    </div>
                  </div>
                  {user && activityDetail.data.host_id && String(activityDetail.data.host_id) === String(user.id) && (
                    <>
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <Link to="/cafecito" state={{ editEventId: activityDetail.data.id }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2D5444] text-white text-xs font-semibold hover:bg-[#2D5444]/90 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" /> Editar cafecito
                        </Link>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#E89A94] text-[#E89A94] text-xs font-semibold hover:bg-[#E89A94] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={openDeleteConfirm}
                          disabled={deletingActivity}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> {deletingActivity ? 'Eliminando...' : 'Eliminar cafecito'}
                        </button>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[#1E1E1E] mb-2">Inscritos en este cafecito</h4>
                        {cafecitoRegistrations.length === 0 ? (
                          <p className="text-sm text-[#8E8E8E]">Aún no hay inscritos.</p>
                        ) : (
                          <ul className="space-y-2">
                            {cafecitoRegistrations.map((r) => (
                              <li key={r.user_id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                                {r.avatar_url ? <img src={r.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-[#7CA982]/30 flex items-center justify-center"><span className="text-[#2D5444] font-semibold">{(r.full_name || '?')[0]}</span></div>}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-[#1E1E1E] truncate">{r.full_name || 'Usuario'}</p>
                                  {r.phone_number && <p className="text-xs text-[#6E6E6E]">{r.phone_number}</p>}
                                </div>
                                {r.phone_number && <a href={`tel:${r.phone_number}`} className="text-[#7CA982] hover:underline text-sm font-medium">Llamar</a>}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  )}
                  <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => { setSelectedActivity(null); setActivityDetail(null); }}>
                      Cerrar
                    </Button>
                  </div>
                </>
                );
              })()}
              {activityDetail && activityDetail.type === 'listing' && activityDetail.data && (
                <>
                  {/* Imagen reducida */}
                  <div className="relative rounded-xl overflow-hidden mb-4 w-full" style={{ height: '10rem' }}>
                    {activityDetail.data.images?.length > 0 ? (
                      <img
                        src={activityDetail.data.images[0]}
                        alt={activityDetail.data.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    {activityDetail.data.exchange_mode === 'barter' ? (
                      <div className="absolute top-2 left-2 bg-[#F5C542] text-[#1E1E1E] px-3 py-1 rounded-full text-sm font-semibold">Trueque</div>
                    ) : (
                      <div className="absolute top-2 left-2 bg-[#7CA982] text-[#1E1E1E] px-2 py-0.5 rounded-full text-xs font-semibold">Marketplace</div>
                    )}
                  </div>

                  {/* Categoría: valor en bold naranja, sin corchetes */}
                  <div className="mb-3">
                    <span className="text-sm text-[#6E6E6E]">Categoría: </span>
                    <span className="font-bold text-[#F97316]">
                      {(activityDetail.data.category || '')
                        .replace(/\[|\]/g, '')
                        .replace(/^Categoría:\s*/i, '')
                        .trim() || '—'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">{activityDetail.data.title}</h3>

                  {activityDetail.data.profiles && (
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                      {activityDetail.data.profiles.avatar_url ? (
                        <img src={activityDetail.data.profiles.avatar_url} alt={activityDetail.data.profiles.full_name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-semibold text-[#6E6E6E]">{activityDetail.data.profiles.full_name?.[0]}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#1E1E1E]">{activityDetail.data.profiles.full_name}</p>
                        {activityDetail.data.profiles.location && (
                          <div className="flex items-center gap-1 text-sm text-[#8E8E8E]">
                            <MapPin className="w-4 h-4" />
                            <span>{activityDetail.data.profiles.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activityDetail.data.exchange_mode === 'sale' && activityDetail.data.price != null && (
                    <p className="text-2xl font-bold text-[#2D5444] mb-3">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(activityDetail.data.price)}
                    </p>
                  )}
                  {activityDetail.data.exchange_mode === 'barter' && (
                    <p className="text-lg font-semibold text-[#F5C542] mb-3">Intercambio</p>
                  )}

                  {/* Descripción: título fijo "Descripción" y texto debajo de categoría */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#1E1E1E] mb-1">Descripción</h4>
                    <p className="text-[#5F5F5F] leading-relaxed whitespace-pre-wrap">{activityDetail.data.description || '—'}</p>
                  </div>

                  {/* Etiquetas: solo pills redondeados, sin título "Etiquetas" */}
                  {activityDetail.data.tags?.filter((t: string) => !t.startsWith('cantidad:') && !t.startsWith('tipo:')).length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {activityDetail.data.tags
                        .filter((t: string) => !t.startsWith('cantidad:') && !t.startsWith('tipo:'))
                        .map((tag: string, idx: number) => {
                          const tagStyles = ['bg-[#7CA982]/15 text-[#3E6049]', 'bg-[#CDE6E0] text-[#3E6049]', 'bg-[#e74865]/15 text-[#5F5F5F]'];
                          return (
                            <span
                              key={idx}
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${tagStyles[idx % 3]}`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                    </div>
                  ) : null}

                  {user && activityDetail.data.user_id && String(activityDetail.data.user_id) === String(user.id) ? (
                    <>
                      {activityDetail.data.status !== 'completed' && (
                        <Button
                          variant="primary"
                          className="w-full flex items-center justify-center gap-2 mb-4"
                          onClick={handleMarkListingComplete}
                          disabled={markingListingComplete}
                        >
                          {markingListingComplete ? 'Guardando...' : activityDetail.data.exchange_mode === 'barter' ? 'Marcar como intercambiado' : 'Marcar como comprado'}
                        </Button>
                      )}
                      {activityDetail.data.status === 'completed' && (
                        <p className="text-[#7CA982] font-semibold mb-4">✓ {activityDetail.data.exchange_mode === 'barter' ? 'Intercambiado' : 'Comprado'}</p>
                      )}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[#1E1E1E] mb-2">Personas que mostraron interés</h4>
                        {listingInterested.length === 0 ? (
                          <p className="text-sm text-[#8E8E8E]">Aún no hay interesados.</p>
                        ) : (
                          <ul className="space-y-2">
                            {listingInterested.map((u) => (
                              <li key={u.user_id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                                {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-[#7CA982]/30 flex items-center justify-center"><span className="text-[#2D5444] font-semibold">{(u.full_name || '?')[0]}</span></div>}
                                <p className="font-medium text-[#1E1E1E] truncate">{u.full_name || 'Usuario'}</p>
                                <Link to={`/perfil/${u.user_id}`} className="text-[#7CA982] hover:underline text-sm font-medium ml-auto">Ver perfil</Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#E89A94] text-[#E89A94] text-xs font-semibold hover:bg-[#E89A94] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        onClick={openDeleteConfirm}
                        disabled={deletingActivity}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> {deletingActivity ? 'Eliminando...' : 'Eliminar publicación'}
                      </button>
                    </>
                  ) : (
                    <>
                      {activityDetail.data.profiles?.phone_number ? (
                        <Button variant="primary" className="w-full flex items-center justify-center gap-2" onClick={() => { window.location.href = `tel:${activityDetail.data.profiles?.phone_number}`; }}>
                          <Phone className="w-5 h-5" /> Contactar: {activityDetail.data.profiles.phone_number}
                        </Button>
                      ) : (
                        <p className="text-center text-[#8E8E8E] text-sm py-2">El vendedor no ha proporcionado contacto</p>
                      )}
                    </>
                  )}
                  <div className="flex justify-end mt-3">
                    <Button variant="secondary" onClick={() => { setSelectedActivity(null); setActivityDetail(null); }}>
                      Cerrar
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {deleteConfirmOpen && activityDetail && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
          onClick={closeDeleteConfirm}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#E89A94]/20 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-[#E89A94]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1E1E1E]">¿Estás segura?</h3>
            </div>
            <p className="text-[#5F5F5F] text-sm leading-relaxed mb-6">
              {activityDetail.type === 'cafecito'
                ? 'El cafecito y todas las inscripciones se borrarán permanentemente. Esta acción no se puede deshacer.'
                : 'La publicación y los datos asociados (intereses, etc.) se borrarán permanentemente. Esta acción no se puede deshacer.'}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outlined" className="px-4 py-2 text-sm" onClick={closeDeleteConfirm}>
                Cancelar
              </Button>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-[#E89A94] text-white text-sm font-semibold hover:bg-[#E89A94]/90 transition-colors"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Chat */}
      {selectedChat && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedChat(null)}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#CF3F7A] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-white">{selectedChat.name}</h3>
                  <p className="text-sm text-white/80">En línea</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChat(null)}
                className="text-white hover:text-white/80 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 h-96 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-xs">
                    <p className="text-[#2D5444]">{selectedChat.lastMessage}</p>
                    <p className="text-xs text-[#6E6E6E] mt-2">{selectedChat.time}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#CF3F7A] p-4 rounded-2xl rounded-tr-none shadow-sm max-w-xs">
                    <p className="text-white">¡Genial! Me encantaría conectar contigo</p>
                    <p className="text-xs text-white/80 mt-2">Hace 2 min</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#CF3F7A] outline-none"
                />
                <button className="bg-[#CF3F7A] text-white p-3 rounded-full hover:bg-[#CF3F7A]/90 transition-all">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Intereses */}
      {showInterestsModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowInterestsModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#2D5444] flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#CF3F7A]" />
                  Selecciona tus intereses
                </h2>
                <p className="text-sm text-[#6E6E6E] mt-2">
                  Elige los temas que te interesan para personalizar tu experiencia en Beginss
                </p>
              </div>
              <button
                onClick={() => setShowInterestsModal(false)}
                className="text-[#6E6E6E] hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Intereses Seleccionados */}
            {formData.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#2D5444] mb-3 uppercase tracking-wide">
                  Intereses seleccionados ({formData.interests.length})
                </h3>
                <div className="flex flex-wrap gap-2 p-4 bg-[#FEF4EF] rounded-xl border border-[#CF3F7A]/20">
                  {formData.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-[#CF3F7A] text-white flex items-center gap-2"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Campo para agregar intereses personalizados */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2D5444] mb-2">
                Agregar interés personalizado
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomInterest();
                    }
                  }}
                  placeholder="Escribe un interés y presiona Enter..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#CF3F7A] focus:ring-2 focus:ring-[#CF3F7A]/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddCustomInterest}
                  disabled={!customInterest.trim()}
                  className="px-6 py-3 bg-[#CF3F7A] text-white rounded-full font-semibold hover:bg-[#CF3F7A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Agregar
                </button>
              </div>
            </div>

            {/* Etiquetas predefinidas */}
            <div>
              <h3 className="text-sm font-semibold text-[#2D5444] mb-4 uppercase tracking-wide">
                Intereses sugeridos
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-[#2D5444] text-white shadow-md'
                        : 'bg-gray-100 text-[#6E6E6E] hover:bg-gray-200 hover:text-[#2D5444]'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowInterestsModal(false);
                  setCustomInterest('');
                }}
                className="flex-1 py-3 bg-gray-100 text-[#6E6E6E] rounded-full font-semibold hover:bg-gray-200 transition-all"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowInterestsModal(false);
                  setCustomInterest('');
                }}
                className="flex-1 py-3 bg-[#2D5444] text-white rounded-full font-semibold hover:bg-[#2D5444]/90 transition-all"
              >
                Aplicar cambios
              </button>
            </div>
            <p className="text-xs text-center text-[#6E6E6E] mt-3">
              Los cambios se aplicarán al formulario. Presiona "Guardar" en el formulario principal para guardarlos permanentemente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
