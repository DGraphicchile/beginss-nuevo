import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { Briefcase, Heart, Palette, Leaf, TreePine, ShoppingBag, TrendingUp, Sparkles, Infinity, ArrowRight, Users } from 'lucide-react';
import Button from '../components/Button';
import WaveDivider from '../components/WaveDivider';
import FloatingElements from '../components/FloatingElements';
import { useAuth } from '../lib/AuthContext';

const CIRCLE_IDS = ['economia', 'armonia', 'arte', 'sostenibilidad', 'medio-ambiente', 'consumo'] as const;
const CIRCLE_ICONS = [Briefcase, Heart, Palette, Leaf, TreePine, ShoppingBag];
const CIRCLE_COLORS = ['#2D5444', '#cf3f5c', '#9b7fbd', '#2D5444', '#2D5444', '#E2725B'];

export default function Circulos() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const circulos = CIRCLE_IDS.map((id, index) => ({
    id,
    icon: CIRCLE_ICONS[index],
    color: CIRCLE_COLORS[index],
    title: t(`circulosPage.circles.${id}.title`),
    description: t(`circulosPage.circles.${id}.description`),
    tags: t(`circulosPage.circles.${id}.tags`, { returnObjects: true }) as string[],
  }));

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
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D5444]">{t('circulosPage.hero.badge')}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
              <Trans i18nKey="circulosPage.hero.title" components={{ br: <br /> }} />
            </h2>
            <p className="text-xl text-white max-w-4xl mx-auto leading-relaxed mb-4 drop-shadow-md">
              {t('circulosPage.hero.description')}
            </p>
            <p className="text-lg text-white/90 max-w-3xl mx-auto drop-shadow-md">
              {t('circulosPage.hero.description2')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {circulos.map((circulo, index) => (
                <Link
                  key={circulo.id}
                  to={`/circulos/${circulo.id}`}
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
                      <span>{t('circulosPage.explore')}</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </Link>
            ))}
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
                  {t('circulosPage.cta.joinToday')}
                </h3>
                <p className="text-xl text-[#1E1E1E] mb-8">
                  {t('circulosPage.cta.worldWeWant')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!user && (
                    <Link to="/registro">
                      <Button variant="cta" className="text-lg px-8 py-4">
                        {t('circulosPage.cta.createProfileNow')}
                      </Button>
                    </Link>
                  )}
                  <Link to="/marketplace">
                    <Button variant="secondary" className="text-lg bg-[#1E1E1E] text-white hover:bg-[#000000] border-[#1E1E1E] px-8 py-4">
                      {t('circulosPage.cta.exploreMarketplace')}
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
