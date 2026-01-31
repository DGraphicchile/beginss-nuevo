import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-8xl font-bold text-[#2D5444]/20 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <Home className="w-4 h-4" />
              Ir al inicio
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
}
