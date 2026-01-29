import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FAF7F2] border-t border-[#7CA982]/20">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <img src="/logo-beginns-full.svg" alt="Beginss" className="h-12" />
            </div>
            <p className="text-[#5F5F5F] text-base mb-6 max-w-md leading-relaxed">
              Una comunidad circular de mujeres enfocada en bienestar, sostenibilidad, arte y colaboración. Cada intercambio es una semilla que florece en comunidad.
            </p>
            <a
              href="https://www.instagram.com/beginsscomunidad?igsh=NjF1cDludnNsOW04"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-10 h-10 bg-[#7CA982] hover:bg-[#3E6049] rounded-full items-center justify-center transition-colors"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#3E6049]">Explorar</h3>
            <ul className="space-y-2 text-sm text-[#5F5F5F]">
              <li>
                <Link to="/marketplace" className="hover:text-[#7CA982] transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/cafecito" className="hover:text-[#7CA982] transition-colors">
                  Cafecito
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#3E6049]">Información</h3>
            <ul className="space-y-2 text-sm text-[#5F5F5F]">
              <li>
                <Link to="/valores" className="hover:text-[#7CA982] transition-colors">
                  Sobre nosotras
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[#7CA982] transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#7CA982] transition-colors">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#7CA982]/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-[#8E8E8E]">
              © 2026 Beginss. Todos los derechos reservados.
            </p>
            <p className="text-sm text-[#8E8E8E]">
              Pronto app móvil disponible
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
