import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Heart, Leaf, Sparkles, Users, ArrowRight, Gift, Lightbulb, TreePine, Handshake, Star, TrendingUp, Infinity, UserPlus, Repeat, Store, Globe, MessageCircle, Circle } from 'lucide-react';
import Button from '../components/Button';
import WaveDivider from '../components/WaveDivider';
import { useAuth } from '../lib/AuthContext';

const APP_DOWNLOAD_URL = import.meta.env.VITE_APP_DOWNLOAD_URL || '';

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const valueKeys = ['bienestar', 'empoderamiento', 'generosidad', 'innovacion', 'naturaleza', 'sostenibilidad', 'sororidad', 'circularidad'] as const;
  const valueIcons = [Heart, TrendingUp, Gift, Lightbulb, TreePine, Leaf, Handshake, Infinity];
  const valueColors = ['#2D5444', '#cf3f5c', '#F5C542', '#E2725B', '#2D5444', '#1E1E1E', '#cf3f5c', '#F5C542'];
  const valores = valueKeys.map((key, i) => ({
    icon: valueIcons[i],
    nameKey: `home.values.${key}.name`,
    descKey: `home.values.${key}.description`,
    color: valueColors[i],
  }));

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
{/* Hero Section */}
<section
  className="relative text-white bg-cover bg-center bg-no-repeat overflow-hidden flex items-center justify-center min-h-screen"
  style={{ backgroundImage: "url('/hero-home-3.jpg')" }}
>
  {/* Capa de oscurecimiento para legibilidad */}
  <div className="absolute inset-0 bg-black/30"></div>

  {/* Contenido principal */}
  <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full">
    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
      
      <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-[#CF3F7A] rounded-full shadow-md">
        <Circle className="w-3 h-3 fill-white text-white" />
        <span className="text-white text-xs font-bold uppercase tracking-wider">
          {t('home.hero.badge')}
        </span>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
        {t('home.hero.title1')}
        <br />
        {t('home.hero.title2')}
      </h1>
      <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl drop-shadow">
        {t('home.hero.subtitle')}
      </p>
      {!user && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <Link to="/registro">
            <Button variant="cta" className="w-full sm:w-auto">
              {t('home.hero.joinCircle')}
            </Button>
          </Link>
        </div>
      )}
      <div className="mb-10">
        <img
          src="/logo-hor-beige.svg"
          alt="Beginss Logo"
          className="w-48 md:w-56 lg:w-64 mx-auto drop-shadow-lg"
        />
      </div>
      <div className="flex items-center justify-center text-center">
        <p className="text-white/70 text-sm">{t('home.hero.tagline')}</p>
      </div>
    </div>
  </div>

  {/* Wave divider inferior */}
  <div className="absolute bottom-0 left-0 w-full z-10">
    <WaveDivider color="#fef4ef" />
  </div>
</section>


{/* Sección: Cómo funciona Beginss */}
<section className="bg-[#fef4ef] py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

<div className="relative w-full max-w-xl mx-auto">
  {/* Fondo rosado: mismo tamaño aprox, solo asomado arriba y derecha */}
  <div
    className="absolute -right-3 -top-3 w-[102%] h-[102%] bg-[#CF3F7A] rounded-[2rem] rotate-2 pointer-events-none"
  />

  {/* Imagen principal */}
  <img
    src="/new-home-sec2.jpg"
    alt="Usando la app Beginss"
    className="relative z-10 w-full rounded-[2rem] object-cover shadow-xl"
  />
</div>


    <div>
      <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white shadow-sm">
        <span className="h-2 w-2 rounded-full bg-[#CF3F7A]" />
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2D5444]">
          {t('home.howItWorks.label')}
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E1E1E] leading-tight mb-4">
        <Trans i18nKey="home.howItWorks.title" components={{ br: <br /> }} />
      </h2>
      <p className="text-[15px] sm:text-base text-[#3C3C3C] leading-relaxed mb-8">
        {t('home.howItWorks.description')}
      </p>
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#F5C542]/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#F5C542] text-[#1E1E1E] flex items-center justify-center font-bold">1</div>
          <div>
            <h3 className="font-semibold text-[#2D5444] text-lg">{t('home.howItWorks.step1Title')}</h3>
            <p className="text-[#5e3920] text-sm leading-relaxed">{t('home.howItWorks.step1Desc')}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#b2d9d9]/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#2D5444] text-white flex items-center justify-center font-bold">2</div>
          <div>
            <h3 className="font-semibold text-[#2D5444] text-lg">{t('home.howItWorks.step2Title')}</h3>
            <p className="text-[#5e3920] text-sm leading-relaxed">{t('home.howItWorks.step2Desc')}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#CF3F7A]/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#CF3F7A] text-white flex items-center justify-center font-bold">3</div>
          <div>
            <h3 className="font-semibold text-[#2D5444] text-lg">{t('home.howItWorks.step3Title')}</h3>
            <p className="text-[#5e3920] text-sm leading-relaxed">{t('home.howItWorks.step3Desc')}</p>
          </div>
        </div>
      </div>
      {!user && (
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button variant="cta" className="px-8 py-3 text-base sm:text-lg">
            {t('home.howItWorks.createProfile')}
          </Button>
          {APP_DOWNLOAD_URL && (
            <a href={APP_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outlined"
                className="px-8 py-3 text-base sm:text-lg !bg-white !border-[#2D5444] !text-[#2D5444] hover:!bg-[#2D5444] hover:!text-white"
              >
                {t('home.howItWorks.downloadApp')}
              </Button>
            </a>
          )}
        </div>
      )}
      {!APP_DOWNLOAD_URL && (
        <p className="mt-6 text-center text-sm text-[#6E6E6E] italic">
          {t('home.howItWorks.appComingSoon')}
        </p>
      )}

    </div>
  </div>
</section>


      
<section className="relative bg-[#FEF4EF]">
  {/* decoraciones suaves */}
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -top-8 -left-12 h-40 w-40 rounded-full bg-[#F7EFE9] opacity-60 blur-2xl" />
    <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-[#2D5444] opacity-10 blur-2xl" />
  </div>

  {/* contenedor principal */}
  <div className="relative mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-16">
    {/* Columna izquierda: collage */}
    <div className="mx-auto w-full max-w-xl grid grid-cols-2 gap-6">
      {/* Tile 1 — ícono centrado */}
      <div className="flex items-center justify-center rounded-[2rem] bg-[#EFE9E5] p-8 shadow-sm">
        <img
          src="/recurso-5.svg"  
          alt="Ícono Beginss"
          className="h-20 w-20 object-contain"
        />
      </div>

      {/* Tile 2 — imagen vertical */}
      <div className="overflow-hidden rounded-[2rem] rounded-tl-[4rem] shadow-md">
        <img
          src="/portrait-of-six-laughing-women-of-different-ages-a-2025-03-05-05-11-11-utc.jpg"
          alt="Mujeres sonriendo"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Tile 3 — imagen horizontal */}
      <div className="col-span-2 overflow-hidden rounded-[2rem] shadow-md">
        <img
          src="/two-young-multi-ethnic-woman-friends-feeding-the-s-2025-01-29-02-18-23-utc.jpg"
          alt="Comunidad Beginss"
          className="h-56 w-full object-cover md:h-64"
        />
      </div>

      {/* Tile 4 — fondo con imagen cuadrada centrada */}
      <div className="hidden md:block">
        <div className="relative h-52 rounded-[2rem] bg-white shadow-md">
          {/* Fondo con gradientes Beginss */}
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,#F28C7B33_0,transparent_55%),radial-gradient(circle_at_70%_80%,#2D544433_0,transparent_50%)]" />

          {/* Imagen cuadrada centrada */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-[1.5rem] bg-[#EFE9E5] shadow-md">
              <img
                src="/young-women-chatting-and-laughing-in-casual-boho-o-2025-03-05-05-13-49-utc.jpg"
                alt="Icono Beginss"
                className="h-24 w-24 object-cover rounded-[1rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-xl">
  <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight text-[#1E1E1E]">
    {t('home.whatYouCanDo.title')}
  </h2>
  <p className="mt-6 text-[17px] leading-7 text-[#3C3C3C]">
    {t('home.whatYouCanDo.description')}
  </p>
  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
    <div className="group rounded-2xl bg-white/95 border border-[#F5C542]/30 p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl">
      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#856019]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#F5C542]" />
        {t('home.whatYouCanDo.marketplace')}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-[#2D5444]">{t('home.whatYouCanDo.marketplaceTitle')}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[#3C3C3C]">{t('home.whatYouCanDo.marketplaceDesc')}</p>
    </div>
    <div className="group rounded-2xl bg-white/95 border border-[#b2d9d9]/40 p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl">
      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1F4138]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#b2d9d9]" />
        {t('home.whatYouCanDo.connections')}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-[#2D5444]">{t('home.whatYouCanDo.connectionsTitle')}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[#3C3C3C]">{t('home.whatYouCanDo.connectionsDesc')}</p>
    </div>
    <div className="group rounded-2xl bg-white/95 border border-[#CF3F7A]/30 p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl">
      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8C234D]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#CF3F7A]" />
        {t('home.whatYouCanDo.collaboration')}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-[#2D5444]">{t('home.whatYouCanDo.collaborationTitle')}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[#3C3C3C]">{t('home.whatYouCanDo.collaborationDesc')}</p>
    </div>
    <div className="group rounded-2xl bg-white/95 border border-[#2D5444]/25 p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl">
      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2D5444]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#2D5444]" />
        {t('home.whatYouCanDo.barter')}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-[#2D5444]">{t('home.whatYouCanDo.barterTitle')}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[#3C3C3C]">{t('home.whatYouCanDo.barterDesc')}</p>
    </div>
  </div>
</div>


  </div>
</section>

{/* Banner decorativo tipo Beginss */}
<section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#fef4ef]">
  <div className="max-w-7xl mx-auto relative">

    {/* Contenedor principal del banner */}
    <div className="relative h-[160px] md:h-[200px] rounded-[2rem] overflow-hidden shadow-xl bg-gray-200">

      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: "url('/fondo-app-promo.jpg')", backgroundPosition: '50% 18%' }}
      />

      {/* Overlay suave opcional */}
      <div className="absolute inset-0 bg-black/5" />
    </div>

    {/* Íconos decorativos */}

    {/* Izquierda */}
    <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
      <Sparkles className="w-6 h-6 text-[#CF3F7A]" />
    </div>

    {/* Derecha arriba */}
    <div className="absolute right-[-20px] top-[25%] w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
      <Heart className="w-6 h-6 text-[#F5C542]" />
    </div>

    {/* Derecha abajo */}
    <div className="absolute right-[-20px] bottom-[25%] w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
      <Users className="w-6 h-6 text-[#2D5444]" />
    </div>
  </div>
</section>



      {/* How it Works Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{
        background: 'radial-gradient(ellipse 150% 80% at 50% -20%, #f5d4d9 0%, #fef5f0 35%, #ffffff 60%)'
      }}>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#E2725B] rounded-full"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-[#F5C542] rounded-full"></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-[#2D5444] rounded-full"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
              <div className="w-2 h-2 bg-[#2D5444] rounded-full"></div>
              <span className="text-[#1E1E1E] text-xs font-bold uppercase tracking-wider">{t('home.communityHow.label')}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-[#1E1E1E] mb-6 mt-6">
              {t('home.communityHow.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('home.communityHow.description')}
            </p>
          </div>

          {/* Asymmetric layout */}
          <div className="space-y-16">
            {/* Row 1 - Offset layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#F5C542] rounded-full opacity-20"></div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-[#F5C542] rounded-full flex items-center justify-center z-10">
                  <UserPlus className="w-4 h-4 text-[#1E1E1E]" />
                </div>
                <div className="relative bg-white rounded-[2.5rem] p-8 shadow-lg">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#F5C542] rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#1E1E1E]">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">
                        {t('home.communityHow.step1Title')}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t('home.communityHow.step1Desc')}
                      </p>
                    </div>
                  </div>
                  <img
                    src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Crea perfil"
                    className="w-full h-56 object-cover rounded-2xl mt-6"
                  />
                  <div className="absolute bottom-8 right-8 flex gap-2">
                    <div className="w-2 h-2 bg-[#F5C542] rounded-full"></div>
                    <div className="w-2 h-2 bg-[#2D5444] rounded-full"></div>
                    <div className="w-2 h-2 bg-[#cf3f5c] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="relative md:translate-y-12">
                <div className="absolute top-6 right-6 w-24 h-24 border-4 border-[#2D5444] rounded-full opacity-10"></div>
                <div className="absolute -top-4 left-8 w-10 h-10 bg-white rounded-xl flex items-center justify-center z-10 shadow-md">
                  <Users className="w-5 h-5 text-[#2D5444]" />
                </div>
                <div className="relative bg-[#2D5444] rounded-[2.5rem] p-8 shadow-lg">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#2D5444]">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {t('home.communityHow.step2Title')}
                      </h3>
                      <p className="text-white/90 leading-relaxed">
                        {t('home.communityHow.step2Desc')}
                      </p>
                    </div>
                  </div>
                  <img
                    src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Conecta"
                    className="w-full h-56 object-cover rounded-2xl mt-6 opacity-90"
                  />
                  <div className="absolute -bottom-3 left-10 flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#F5C542] rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
                    <div className="w-1.5 h-1.5 bg-[#F5C542] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 - Offset opposite */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative md:-translate-y-12">
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#cf3f5c] rounded-full opacity-20"></div>
                <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center z-10 shadow-lg">
                  <Repeat className="w-6 h-6 text-[#cf3f5c]" />
                </div>
                <div className="relative bg-[#cf3f5c] rounded-[2.5rem] p-8 shadow-lg">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#cf3f5c]">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {t('home.communityHow.step3Title')}
                      </h3>
                      <p className="text-white/90 leading-relaxed">
                        {t('home.communityHow.step3Desc')}
                      </p>
                    </div>
                  </div>
                  <img
                    src="/shopkeepers-filling-reusable-bags-with-food-in-zer-2025-04-25-18-19-29-utc.jpg"
                    alt="Intercambia"
                    className="w-full h-56 object-cover rounded-2xl mt-6"
                  />
                  <div className="absolute bottom-6 left-8">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                      <div className="w-3 h-3 bg-[#F5C542] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#F5C542] rounded-full opacity-20"></div>
                <div className="absolute -top-3 right-10 w-10 h-10 bg-[#2D5444] rounded-2xl flex items-center justify-center z-10 rotate-12 shadow-md">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="relative bg-white rounded-[2.5rem] p-8 shadow-lg">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#2D5444] rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">4</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">
                        {t('home.communityHow.step4Title')}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t('home.communityHow.step4Desc')}
                      </p>
                    </div>
                  </div>
                  <img
                    src="https://images.pexels.com/photos/4498220/pexels-photo-4498220.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Muestra"
                    className="w-full h-56 object-cover rounded-2xl mt-6"
                  />
                  <div className="absolute bottom-10 right-6 flex flex-col gap-2">
                    <div className="w-2 h-2 bg-[#2D5444] rounded-full"></div>
                    <div className="w-2 h-2 bg-[#F5C542] rounded-full"></div>
                    <div className="w-2 h-2 bg-[#cf3f5c] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3 - Cards 5 & 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F5C542] rounded-full opacity-20"></div>
                <div className="absolute bottom-8 right-8 w-10 h-10 bg-[#1E1E1E] rounded-xl flex items-center justify-center z-10 rotate-12 shadow-md">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="relative bg-[#F5C542] rounded-[2.5rem] p-8 shadow-lg">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#1E1E1E] rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">5</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">
                        {t('home.communityHow.step5Title')}
                      </h3>
                      <p className="text-[#1E1E1E]/80 leading-relaxed">
                        {t('home.communityHow.step5Desc')}
                      </p>
                    </div>
                  </div>
                  <img
                    src="/a-happy-teenager-is-standing-and-holding-vegetable-2025-03-16-09-38-27-utc.jpg"
                    alt="Conecta"
                    className="w-full h-56 object-cover rounded-2xl mt-6"
                  />
                  <div className="absolute -bottom-2 left-12 flex gap-2">
                    <div className="w-2 h-2 bg-[#1E1E1E] rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                    <div className="w-2 h-2 bg-[#1E1E1E] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-6 right-6 w-24 h-24 border-4 border-[#cf3f5c] rounded-full opacity-10"></div>
                <div className="absolute -top-3 left-10 w-10 h-10 bg-[#cf3f5c] rounded-2xl flex items-center justify-center z-10 shadow-md">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="relative bg-white rounded-[2.5rem] p-8 shadow-lg border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#cf3f5c] rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">6</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">
                        {t('home.communityHow.step6Title')}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t('home.communityHow.step6Desc')}
                      </p>
                    </div>
                  </div>
                  <img
                    src="/funny-asian-and-caucasian-woman-with-disposable-cu-2025-03-25-02-22-12-utc.jpg"
                    alt="Organiza"
                    className="w-full h-56 object-cover rounded-2xl mt-6"
                  />
                  <div className="absolute bottom-8 right-6 flex flex-col gap-2">
                    <div className="w-2 h-2 bg-[#cf3f5c] rounded-full"></div>
                    <div className="w-2 h-2 bg-[#F5C542] rounded-full"></div>
                    <div className="w-2 h-2 bg-[#2D5444] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!user && (
            <div className="text-center mt-16">
              <Link to="/registro">
                <Button variant="primary" className="text-lg">
                  {t('home.communityHow.startNow')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

{false && (
<section className="px-4 py-8">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* Card BHP x Beginss */}
    <a
      href="https://beginss-micrositio-b-re2h.bolt.host/"
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <img
        src="/bhp-small-80.jpg"
        alt="BHP x Beginss"
        className="w-full h-auto rounded-[2rem] shadow-xl 
                   transition-transform duration-300 group-hover:-translate-y-1 
                   group-hover:shadow-2xl"
      />
    </a>

    {/* Card Dove x Beginss */}
    <a
      href="https://beginss-micrositio-d-tclv.bolt.host/"
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <img
        src="/dove-small-80.jpg"
        alt="Dove x Beginss"
        className="w-full h-auto rounded-[2rem] shadow-xl 
                   transition-transform duration-300 group-hover:-translate-y-1 
                   group-hover:shadow-2xl"
      />
    </a>

  </div>
</section>
)}

      <WaveDivider color="#ffffff" flip={true} />

      {/* Values Section */}
      <section className="pt-0 pb-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Background gradient circle */}
       <div className="absolute inset-x-0 top-0 flex items-center justify-center overflow-hidden pointer-events-none">
  <div className="w-[2000px] max-w-none h-[650px] rounded-t-full bg-gradient-to-b from-[#F7EFE9] to-white" />
</div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#E2725B] text-white rounded-full">
              <Star className="w-3 h-3 fill-white" />
              <span className="text-xs font-bold uppercase tracking-wider">{t('home.values.label')}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-[#1E1E1E] mb-6 mt-6">
              {t('home.values.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('home.values.description')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {valores.map((valor, index) => (
              <div
                key={index}
                className="group relative bg-[#FAFAFA] rounded-[2rem] p-8 text-center hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="absolute top-2 right-2 w-8 h-8 border-2 rounded-full opacity-0 group-hover:opacity-20 transition-opacity" style={{ borderColor: valor.color }}></div>
                <div className="relative z-10">
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: valor.color }}
                  >
                    <valor.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-[#1E1E1E] text-lg mb-3">
                    {t(valor.nameKey)}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t(valor.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/circulos">
              <Button variant="primary">
                {t('home.values.discoverCircles')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      
      <WaveDivider color="#ffffff" flip={true} />

      {/* Mujeres Beginss Section */}
      <section className="pt-0 pb-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 right-10 w-3 h-3 bg-[#F5C542] rounded-full"></div>
        <div className="absolute bottom-40 left-10 w-2 h-2 bg-[#E2725B] rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 border-4 border-[#2D5444] rounded-full opacity-5"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#cf3f5c] rounded-full">
                <Star className="w-3 h-3 fill-white text-white" />
                <span className="text-white text-xs font-bold uppercase tracking-wider">{t('home.womenBeginss.label')}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-[#1E1E1E] mb-8 leading-tight">
                {t('home.womenBeginss.title')}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                <Trans i18nKey="home.womenBeginss.para1" components={{ strong: <span className="font-bold text-[#2D5444]" /> }} />
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {t('home.womenBeginss.para2')}
              </p>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-0.5 bg-[#E2725B]"></div>
                <Heart className="w-5 h-5 text-[#E2725B]" />
              </div>
              {!user && (
                <Link to="/registro">
                  <Button variant="primary" className="text-lg">
                    {t('home.womenBeginss.joinCommunity')}
                  </Button>
                </Link>
              )}
            </div>

            <div className="relative order-1 lg:order-2">
              {/* Decorative floating icons */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-[#F5C542] rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-14 h-14 bg-[#E2725B] rounded-2xl flex items-center justify-center shadow-lg animate-pulse" style={{ animationDelay: '1s' }}>
                <Handshake className="w-7 h-7 text-white" />
              </div>
              <div className="absolute top-1/2 -left-6 w-12 h-12 bg-[#2D5444] rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>

              {/* Main image with unique corner styling */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#2D5444] opacity-5 rounded-[1rem]"></div>
                <div className="relative overflow-hidden rounded-tl-[5rem] rounded-tr-[1rem] rounded-bl-[1rem] rounded-br-[1rem] shadow-2xl">
                  <img
  src="/close-friends-sharing-a-joyful-embrace-outdoors-2025-02-22-01-38-17-utc.jpg"
  alt="Mujeres Beginss"
  className="w-full h-[500px] object-cover"
/>
                </div>
                {/* Decorative dots */}
                <div className="absolute -top-4 right-12 flex gap-2">
                  <div className="w-2 h-2 bg-[#F5C542] rounded-full"></div>
                  <div className="w-2 h-2 bg-[#E2725B] rounded-full"></div>
                  <div className="w-2 h-2 bg-[#2D5444] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="#FAFAFA" />

      {/* Circulos de Accion Section */}
      <section className="pt-0 pb-32 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#2D5444] rounded-full opacity-5 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F5C542] rounded-full opacity-5 blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#2D5444] text-white rounded-full">
              <Infinity className="w-3 h-3" />
              <span className="text-xs font-bold uppercase tracking-wider">{t('home.circles.label')}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-[#1E1E1E] mb-8 leading-tight">
              <Trans i18nKey="home.circles.title" components={{ br: <br /> }} />
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4">
              {t('home.circles.description')}
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              {t('home.circles.description2')}
            </p>
          </div>

          {/* Interactive Circles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Circle 1 - Economia */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D5444] rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-[#2D5444] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4 group-hover:text-[#2D5444] transition-colors">
                  <Trans i18nKey="home.circles.economia.title" components={{ br: <br /> }} />
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('home.circles.economia.description')}
                </p>
                <div className="space-y-2 mb-6 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-500">
                  <div className="flex flex-wrap gap-2">
                    {(t('home.circles.economia.tags', { returnObjects: true }) as string[]).map((item, i) => (
                      <span key={i} className="text-xs bg-[#2D5444]/10 text-[#2D5444] px-3 py-1 rounded-full font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-[#2D5444] font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                  <span>{t('home.circles.explore')}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 w-20 h-20 opacity-5">
                <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200" alt="" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>

            {/* Circle 2 - Arte */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2725B] rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-[#E2725B] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4 group-hover:text-[#E2725B] transition-colors">
                  {t('home.circles.arte.title')}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('home.circles.arte.description')}
                </p>
                <div className="space-y-2 mb-6 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-500">
                  <div className="flex flex-wrap gap-2">
                    {(t('home.circles.arte.tags', { returnObjects: true }) as string[]).map((item, i) => (
                      <span key={i} className="text-xs bg-[#E2725B]/10 text-[#E2725B] px-3 py-1 rounded-full font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-[#E2725B] font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                  <span>{t('home.circles.explore')}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 w-20 h-20 opacity-5">
                <img src="https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=200" alt="" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>

            {/* Circle 3 - Armonia */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C542] rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-[#F5C542] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4 group-hover:text-[#F5C542] transition-colors">
                  {t('home.circles.armonia.title')}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('home.circles.armonia.description')}
                </p>
                <div className="space-y-2 mb-6 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-500">
                  <div className="flex flex-wrap gap-2">
                    {(t('home.circles.armonia.tags', { returnObjects: true }) as string[]).map((item, i) => (
                      <span key={i} className="text-xs bg-[#F5C542]/10 text-[#1E1E1E] px-3 py-1 rounded-full font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-[#F5C542] font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                  <span>{t('home.circles.explore')}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 w-20 h-20 opacity-5">
                <img src="https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=200" alt="" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>

            {/* Circle 4 - Sostenibilidad */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#cf3f5c] rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-[#cf3f5c] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4 group-hover:text-[#cf3f5c] transition-colors">
                  <Trans i18nKey="home.circles.sostenibilidadAccion.title" components={{ br: <br /> }} />
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('home.circles.sostenibilidadAccion.description')}
                </p>
                <div className="space-y-2 mb-6 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-500">
                  <div className="flex flex-wrap gap-2">
                    {(t('home.circles.sostenibilidadAccion.tags', { returnObjects: true }) as string[]).map((item, i) => (
                      <span key={i} className="text-xs bg-[#cf3f5c]/10 text-[#cf3f5c] px-3 py-1 rounded-full font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-[#cf3f5c] font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                  <span>{t('home.circles.explore')}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 w-20 h-20 opacity-5">
                <img src="https://images.pexels.com/photos/1268101/pexels-photo-1268101.jpeg?auto=compress&cs=tinysrgb&w=200" alt="" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>

            {/* Circle 5 - Medio Ambiente */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D5444] rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-[#2D5444] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <TreePine className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4 group-hover:text-[#2D5444] transition-colors">
                  {t('home.circles.medioAmbiente.title')}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('home.circles.medioAmbiente.description')}
                </p>
                <div className="space-y-2 mb-6 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-500">
                  <div className="flex flex-wrap gap-2">
                    {(t('home.circles.medioAmbiente.tags', { returnObjects: true }) as string[]).map((item, i) => (
                      <span key={i} className="text-xs bg-[#2D5444]/10 text-[#2D5444] px-3 py-1 rounded-full font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-[#2D5444] font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                  <span>{t('home.circles.explore')}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 w-20 h-20 opacity-5">
                <img src="https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=200" alt="" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>

            {/* Circle 6 - Consumo */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2725B] rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-[#E2725B] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4 group-hover:text-[#E2725B] transition-colors">
                  {t('home.circles.consumo.title')}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('home.circles.consumo.description')}
                </p>
                <div className="space-y-2 mb-6 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-500">
                  <div className="flex flex-wrap gap-2">
                    {(t('home.circles.consumo.tags', { returnObjects: true }) as string[]).map((item, i) => (
                      <span key={i} className="text-xs bg-[#E2725B]/10 text-[#E2725B] px-3 py-1 rounded-full font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-[#E2725B] font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                  <span>{t('home.circles.explore')}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 w-20 h-20 opacity-5">
                <img src="https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=200" alt="" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>
          </div>

          {/* CTA Card */}
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
                  {t('home.circles.joinToday')}
                </h3>
                <p className="text-xl text-[#1E1E1E] mb-8">
                  {t('home.circles.worldWeWant')}
                </p>
                <Link to="/circulos">
                  <Button variant="secondary" className="text-lg bg-[#1E1E1E] text-white hover:bg-[#000000] border-[#1E1E1E]">
                    {t('home.circles.exploreAll')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="#ffffff" flip={true} />

      {/* Explore Section */}
      <section className="pt-0 pb-32 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="absolute top-20 right-20 w-32 h-32 border-4 border-[#F5C542] rounded-full opacity-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#2D5444] text-white rounded-full">
              <Globe className="w-3 h-3" />
              <span className="text-xs font-bold uppercase tracking-wider">{t('home.explore.label')}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-[#1E1E1E] mb-6 mt-6">
              {t('home.explore.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.explore.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { link: '/marketplace', img: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=600', icon: Leaf, color: '#2D5444', titleKey: 'nav.marketplace', descKey: 'home.explore.marketplaceDesc' },
              { link: '/cafecito', img: '/2.jpg', icon: MessageCircle, color: '#cf3f5c', titleKey: 'nav.cafecito', descKey: 'home.explore.cafecitoDesc' },
              { link: '/circulos', img: '/3.jpg', icon: Users, color: '#F5C542', titleKey: 'nav.circulos', descKey: 'home.explore.circulosDesc' }
            ].map((space, index) => (
              <Link key={index} to={space.link} className="group">
                <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 group-hover:bg-black/10 transition-all z-10"></div>
                    <img
                      src={space.img}
                      alt={t(space.titleKey)}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-md" style={{ backgroundColor: space.color }}>
                      <space.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">
                      {t(space.titleKey)}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {t(space.descKey)}
                    </p>
                    <div className="flex items-center font-semibold group-hover:translate-x-2 transition-transform" style={{ color: space.color }}>
                      <span>{t('home.explore.explore')}</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image with unique shape */}
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-tl-[6rem] rounded-tr-[2rem] rounded-bl-[2rem] rounded-br-[6rem] shadow-2xl">
                <img
                  src="/women-workers-teamwork-2025-02-11-04-51-36-utc.jpg"
                  alt="Mujeres empoderadas"
                  className="w-full h-[600px] object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#F5C542] rounded-full opacity-30"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#cf3f5c] rounded-full opacity-30"></div>
            </div>

            {/* Right side - Content */}
            <div className="relative order-1 lg:order-2">
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-0.5 bg-[#F5C542]"></div>
                  <Circle className="w-4 h-4 fill-[#F5C542] text-[#F5C542]" />
                  <div className="w-12 h-0.5 bg-[#F5C542]"></div>
                </div>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-[#1E1E1E] mb-8 leading-tight">
                <Trans i18nKey="home.cta.title" components={{ br: <br /> }} />
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                {t('home.cta.subtitle')}
              </p>
              {!user && (
                <Link to="/registro">
                  <Button variant="cta" className="text-lg">
                    {t('home.cta.joinNow')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
