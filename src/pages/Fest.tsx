import {
  Sparkles,
  Calendar,
  MapPin,
  Music,
  Users,
  Heart,
  Megaphone,
  Store,
  Mic2,
  Palette,
  Ticket,
  PartyPopper,
} from 'lucide-react';
import Button from '../components/Button';
import FloatingElements from '../components/FloatingElements';

export default function Fest() {
  return (
    <div className="min-h-screen">
      {/* ============== HERO ============== */}
      <header className="relative pt-28 pb-24 text-white overflow-hidden">
        {/* Background image + gradient overlay */}
        <div className="absolute inset-0">
          <img
            src="/fest-hero.jpg"
            alt="Beginss Fest"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#3B2F2F]/10 to-[#3B2F2F]/40" />
        </div>

        <FloatingElements />

        {/* halos suaves */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -top-10 left-1/5 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-12 right-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/25">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Evento anual</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">Beginss Fest</h1>

          <p className="mt-5 text-lg md:text-xl max-w-4xl mx-auto text-white/90 leading-relaxed">
            <strong>Alianzas y Talento:</strong> Charlas, talleres y paneles. Intercambio y venta de
            productos y obras. Música en vivo, exposiciones de arte y espacios compartidos con destacadas
            mujeres referentes de distintas áreas. Una oportunidad única para generar alianzas entre ellas
            y las marcas.
          </p>

          {/* chips estilo Beginss Fest */}
<div className="mt-6 flex flex-wrap justify-center gap-3">
  <span className="px-5 py-2 bg-[#F25C05] text-white font-semibold rounded-full shadow-md rotate-[-2deg]">
    Charlas & Paneles
  </span>
  <span className="px-5 py-2 bg-[#E8A4FF] text-[#1E1E1E] font-semibold rounded-full shadow-md rotate-[2deg]">
    Talleres
  </span>
  <span className="px-5 py-2 bg-[#F5C542] text-[#1E1E1E] font-semibold rounded-full shadow-md rotate-[-3deg]">
    Marketplace & Trueque
  </span>
  <span className="px-5 py-2 bg-[#CF3F5C] text-white font-semibold rounded-full shadow-md rotate-[3deg]">
    Música & Arte
  </span>
</div>

          {/* CTA + nota app */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button
              variant="cta"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#2D5444] hover:bg-[#01492b] text-lg px-8 py-               4 shadow-2xl">
              <Ticket className="h-5 w-5 shrink-0" />
              Comprar entrada
            </Button>
          </div>
        </div>
      </header>

      {/* ============== CONTENIDO ============== */}
      <main className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        <section className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12">
          {/* strip info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <InfoCard
              icon={<Calendar className="w-8 h-8 text-white" />}
              iconBg="#7CA982"
              title="Fecha"
              text="Próximamente"
            />
            <InfoCard
              icon={<MapPin className="w-8 h-8 text-white" />}
              iconBg="#CF3F7A"
              title="Ubicación"
              text="Próximamente"
            />
            <InfoCard
              icon={<Users className="w-8 h-8 text-white" />}
              iconBg="#2D5444"
              title="Asistentes"
              text="Próximamente"
            />
          </div>

{/* Alianzas y Talento */}
<section className="mb-20 px-4 sm:px-8">
  <h2 className="text-4xl font-extrabold text-[#1E1E1E] text-center tracking-tight">
    Alianzas y Talento
  </h2>
  <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
    Donde el conocimiento, el arte y el emprendimiento se encuentran para crear oportunidades reales.
  </p>

  <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {/* Card 1 */}
    <div className="rounded-3xl bg-[#E6F4EE] shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#2D5444] p-8 flex flex-col justify-between">
      <div className="flex items-start gap-3 mb-4">
        <Mic2 className="w-8 h-8 text-[#2D5444]" />
        <h3 className="font-extrabold text-lg text-[#1E1E1E] leading-tight">
          Charlas & Paneles
        </h3>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">
        Voces que inspiran, con foco en bienestar, sostenibilidad y desarrollo.
      </p>
    </div>

    {/* Card 2 */}
    <div className="rounded-3xl bg-[#FFE7F3] shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#CF3F7A] p-8 flex flex-col justify-between">
      <div className="flex items-start gap-3 mb-4">
        <Megaphone className="w-8 h-8 text-[#CF3F7A]" />
        <h3 className="font-extrabold text-lg text-[#1E1E1E] leading-tight">
          Talleres
        </h3>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">
        Aprender haciendo junto a expertas. Metodologías vivenciales.
      </p>
    </div>

    {/* Card 3 */}
    <div className="rounded-3xl bg-[#F7EFE9] shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#2D5444] p-8 flex flex-col justify-between">
      <div className="flex items-start gap-3 mb-4">
        <Store className="w-8 h-8 text-[#2D5444]" />
        <h3 className="font-extrabold text-lg text-[#1E1E1E] leading-tight">
          Marketplace & Trueque
        </h3>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">
        Venta de productos y obras, intercambios con propósito.
      </p>
    </div>

    {/* Card 4 */}
    <div className="rounded-3xl bg-[#FFF1D6] shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#E9B949] p-8 flex flex-col justify-between">
      <div className="flex items-start gap-3 mb-4">
        <Palette className="w-8 h-8 text-[#B7791F]" />
        <h3 className="font-extrabold text-lg text-[#1E1E1E] leading-tight">
          Música & Arte
        </h3>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">
        Conciertos, exposiciones y experiencias sensoriales.
      </p>
    </div>
  </div>
</section>


          {/* Universo Fest + Mosaico */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1E1E] text-center">Universo Fest</h2>
            <p className="mt-3 text-center text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Festival de 2 días que canaliza la experiencia BEGINSS, rotando en distintos lugares de América Latina.
              Un encuentro masivo donde se activan todos los segmentos de la plataforma.
            </p>

            <div className="mt-8 grid grid-cols-12 gap-4">
              <Mosaic src="/beginnsfest-1.jpg" className="col-span-12 sm:col-span-6 lg:col-span-4 rounded-tl-[36px]" />
              <Mosaic src="/beginnsfest-2.jpg" className="col-span-12 sm:col-span-6 lg:col-span-4" />
              <Mosaic src="/beginnsfest-3.jpg" className="col-span-12 lg:col-span-4 rounded-br-[36px]" />
            </div>

            {/* Highlights de una */}
<div className="mt-6 flex flex-wrap justify-center gap-3">
  <Chip color="#f5c542" ring="#f5c542">
    <PartyPopper className="h-4 w-4 text-white" /> 
    <span className="text-white font-semibold tracking-tight">Experiencias en vivo</span>
  </Chip>

  <Chip color="#01492b" ring="#01492b">
    <Store className="h-4 w-4 text-white" /> 
    <span className="text-white font-semibold tracking-tight">Marcas con propósito</span>
  </Chip>

  <Chip color="#5e3920" ring="#5e3920">
    <Sparkles className="h-4 w-4 text-white" /> 
    <span className="text-white font-semibold tracking-tight">Comunidad activa</span>
  </Chip>

  <Chip color="#cf3f5c" ring="#cf3f5c">
    <Users className="h-4 w-4 text-white" /> 
    <span className="text-white font-semibold tracking-tight">Red Beginss</span>
  </Chip>
</div>

          </section>

          {/* Programa (simple y limpio) */}
          <section className="mb-16">
           {/* <h2 className="text-3xl font-bold text-[#1E1E1E] text-center">Programa del Festival</h2>
            <p className="mt-2 text-center text-gray-500">Cronograma detallado: <strong>Próximamente</strong></p */}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Música y Arte */}
  <div className="rounded-[1.5rem] p-6 border shadow-sm bg-[#f6ecdc] border-[#f6ecdc]">
    <div className="flex items-center gap-4 mb-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#ff5001]">
        <Music className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-extrabold text-[#1E1E1E] text-2xl leading-snug">Música y Arte</h3>
    </div>
    <p className="text-[#1E1E1E] font-medium leading-relaxed text-sm">
      Conciertos, instalaciones y performances con sentido.
    </p>
  </div>

  {/* Talleres */}
  <div className="rounded-[1.5rem] p-6 border shadow-sm bg-[#f6ecdc] border-[#f6ecdc]">
    <div className="flex items-center gap-4 mb-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#000000]">
        <Megaphone className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-extrabold text-[#1E1E1E] text-2xl leading-snug">Talleres</h3>
    </div>
    <p className="text-[#1E1E1E] font-medium leading-relaxed text-sm">
      Bienestar, sostenibilidad, emprendimiento y desarrollo personal.
    </p>
  </div>

  {/* Networking */}
  <div className="rounded-[1.5rem] p-6 border shadow-sm bg-[#f6ecdc] border-[#f6ecdc]">
    <div className="flex items-center gap-4 mb-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#01492b]">
        <Users className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-extrabold text-[#1E1E1E] text-2xl leading-snug">Networking</h3>
    </div>
    <p className="text-[#1E1E1E] font-medium leading-relaxed text-sm">
      Conecta, comparte y crea alianzas con otras mujeres.
    </p>
  </div>

  {/* Marketplace */}
  <div className="rounded-[1.5rem] p-6 border shadow-sm bg-[#f6ecdc] border-[#f6ecdc]">
    <div className="flex items-center gap-4 mb-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#b2d9d9]">
        <MapPin className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-extrabold text-[#1E1E1E] text-2xl leading-snug">Marketplace</h3>
    </div>
    <p className="text-[#1E1E1E] font-medium leading-relaxed text-sm">
      Productos sostenibles, arte y diseño independiente.
    </p>
  </div>
</div>

          </section>

{/* EARLY BIRD (verde + beige + fucsia) */}
          <section className="relative rounded-[2rem] p-12 text-center overflow-hidden border"
                   style={{ borderColor: 'rgba(45,84,68,0.28)' }}>
            {/* fondo: beige + velos diagonal en verde y fucsia */}
            <div className="absolute inset-0 -z-10"
                 style={{
                   background:
                     'linear-gradient(180deg,#F7EFE9 0%, #FFF 100%)',
                 }} />
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2D5444]/15 blur-2xl -z-10" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#CF3F7A]/20 blur-2xl -z-10" />

            <Heart className="w-12 h-12 text-[#CF3F7A] mx-auto mb-4" />
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#1E1E1E] mb-3">
              Early Bird – 30% OFF
            </h3>
            <p className="text-gray-700 text-lg mb-6">
              Aprovecha el precio especial de lanzamiento. <em>Fechas por confirmar.</em>
            </p>
            <div className="flex flex-col items-center gap-3">
              <Button
                variant="cta"
                disabled
                className="text-lg px-8 py-4 rounded-full bg-[#2D5444] text-white hover:bg-[#244737] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Comprar entrada ahora
              </Button>
              <p className="text-sm text-gray-500 italic">
                Las entradas estarán disponibles cuando se confirmen las fechas
              </p>
            </div>

            {/* ribete */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-2 ring-[#CF3F7A]/15" />
          </section>
        </section>
      </main>
    </div>
  );
}

/* ======= subcomponentes pequeños para mantener prolijo ======= */

function InfoCard({
  icon,
  iconBg,
  title,
  text,
}: { icon: React.ReactNode; iconBg: string; title: string; text: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow"
           style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <h3 className="font-bold text-[#1E1E1E] mb-1 text-lg">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

function FeatureCard({
  icon, title, text, from, border,
}: { icon: React.ReactNode; title: string; text: string; from: string; border: string }) {
  return (
    <div
      className="rounded-2xl p-6 border shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${from}, #FFFFFF)`,
        borderColor: `${border}33`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-semibold text-[#1E1E1E]">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function Mosaic({ src, className }: { src: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl ${className || ''}`}>
      <img src={src} alt="Universo Beginss" className="h-56 md:h-64 w-full object-cover" />
    </div>
  );
}

function ProgramCard({
  icon, title, text, from, border,
}: { icon: React.ReactNode; title: string; text: string; from: string; border: string }) {
  return (
    <div
      className="rounded-[1.5rem] p-6 border shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${from}, #FFFFFF)`,
        borderColor: border,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-bold text-[#1E1E1E]">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function Chip({
  children, color, ring,
}: { children: React.ReactNode; color: string; ring: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
      style={{ backgroundColor: color, border: `1px solid ${ring}` }}
    >
      {children}
    </span>
  );
}