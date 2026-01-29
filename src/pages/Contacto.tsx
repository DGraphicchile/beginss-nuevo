import { useState, FormEvent } from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';
import Button from '../components/Button';

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F9F7F4] to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#7CA982]/10 rounded-full mb-6">
              <MessageCircle className="w-10 h-10 text-[#7CA982]" />
            </div>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-semibold text-[#3E6049] mb-6">
              Contacto
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#7CA982] to-[#E6A5A1] mx-auto rounded-full mb-8" />
            <p className="text-xl text-[#6E6E6E] max-w-2xl mx-auto leading-relaxed">
              Vive el corazón de la comunidad. Inspírate, conéctate y crea impacto.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-3xl p-10 shadow-lg mb-8">
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#3E6049] mb-6">
                  Escríbenos
                </h2>

                {success ? (
                  <div className="bg-[#7CA982]/10 border border-[#7CA982] rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-[#7CA982] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#3E6049] mb-2">¡Mensaje enviado!</h3>
                    <p className="text-[#6E6E6E]">Gracias por contactarnos. Te responderemos pronto.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#3E6049] mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#3E6049] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#3E6049] mb-2">
                        Mensaje
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/20 outline-none transition-all resize-none"
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="w-full text-lg"
                    >
                      {loading ? 'Enviando...' : 'Enviar mensaje'}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#7CA982]/10 to-white rounded-3xl p-10 border border-[#7CA982]/20">
                <div className="w-14 h-14 bg-[#7CA982] rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#3E6049] mb-4">
                  Email
                </h3>
                <p className="text-[#6E6E6E] mb-2">
                  Responderemos en las próximas 24-48 horas
                </p>
                <a
                  href="mailto:hola@beginss.com"
                  className="text-[#7CA982] font-medium hover:underline"
                >
                  hola@beginss.com
                </a>
              </div>

              <div className="bg-white rounded-3xl p-10 shadow-lg">
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#3E6049] mb-6">
                  Otras Formas de Conectar
                </h3>
                <div className="space-y-4">
                  <a
                    href="/cafecito"
                    className="block p-4 rounded-xl bg-[#F9F7F4] hover:bg-[#7CA982]/10 transition-colors"
                  >
                    <h4 className="font-semibold text-[#3E6049] mb-1">Cafecito</h4>
                    <p className="text-sm text-[#6E6E6E]">
                      Únete a conversaciones en nuestra comunidad
                    </p>
                  </a>
                  <a
                    href="/eventos"
                    className="block p-4 rounded-xl bg-[#F9F7F4] hover:bg-[#7CA982]/10 transition-colors"
                  >
                    <h4 className="font-semibold text-[#3E6049] mb-1">Eventos</h4>
                    <p className="text-sm text-[#6E6E6E]">
                      Participa en talleres y encuentros
                    </p>
                  </a>
                  <a
                    href="/marcas"
                    className="block p-4 rounded-xl bg-[#F9F7F4] hover:bg-[#7CA982]/10 transition-colors"
                  >
                    <h4 className="font-semibold text-[#3E6049] mb-1">Colaboraciones</h4>
                    <p className="text-sm text-[#6E6E6E]">
                      Oportunidades para marcas y alianzas
                    </p>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#E6A5A1]/10 to-white rounded-3xl p-10 border border-[#E6A5A1]/20 text-center">
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#3E6049] mb-4">
                  ¿Eres nueva en Beginss?
                </h3>
                <p className="text-[#6E6E6E] mb-6">
                  Crea tu perfil y comienza a conectar con nuestra comunidad
                </p>
                <a href="/registro">
                  <Button variant="cta" className="w-full">
                    Únete ahora
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
