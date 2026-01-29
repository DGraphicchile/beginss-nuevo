import { Link, useParams } from 'react-router-dom';
import { Construction, ArrowLeft, Sparkles } from 'lucide-react';
import Button from '../components/Button';

export default function EnConstruccion() {
  const { section } = useParams();

  const sectionTitles: Record<string, string> = {
    'trueque': 'Trueque',
    'conexion': 'Conexión y propuestas',
    'servicios': 'Servicios',
    'tiempo': 'Banco de Tiempo'
  };

  const sectionTitle = section ? sectionTitles[section] : 'Esta sección';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F7EFE9] to-white">
      <div className="max-w-2xl w-full text-center">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-[#F5C542] rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative w-32 h-32 bg-gradient-to-br from-[#F5C542] to-[#cf3f5c] rounded-full flex items-center justify-center shadow-2xl">
            <Construction className="w-16 h-16 text-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-6">
          {sectionTitle}
        </h1>

        <div className="bg-white rounded-[2rem] p-8 shadow-xl mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#F5C542]" />
            <h2 className="text-2xl font-bold text-[#1E1E1E]">
              En construcción
            </h2>
            <Sparkles className="w-5 h-5 text-[#cf3f5c]" />
          </div>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Estamos trabajando en esta sección para ofrecerte la mejor experiencia.
            Muy pronto podrás disfrutar de todas las funcionalidades.
          </p>
          <p className="text-gray-500">
            Mientras tanto, explora otras áreas de la plataforma
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/intercambio">
            <Button variant="primary" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a Intercambio
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary">
              Ir al inicio
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>¿Tienes sugerencias para esta sección?</p>
          <Link to="/contacto" className="text-[#2D5444] font-semibold hover:underline">
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}
