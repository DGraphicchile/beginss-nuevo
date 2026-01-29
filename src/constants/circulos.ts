/**
 * Círculos de acción: 6 temas que se usan como categorías en Cafecito, Marketplace y Trueque.
 * Los títulos son las categorías que el usuario puede asignar (una o varias) a sus publicaciones.
 */

export interface CirculoCategory {
  id: string;
  title: string;
}

/** IDs y títulos de los 6 círculos de acción. Usar title como categoría en formularios y filtros. */
export const CIRCULOS_CATEGORIAS: CirculoCategory[] = [
  { id: 'economia', title: 'Economía y Trabajo Colaborativo' },
  { id: 'armonia', title: 'Bienestar y Armonía Emocional' },
  { id: 'arte', title: 'Arte con Sentido' },
  { id: 'sostenibilidad', title: 'Sostenibilidad en Acción' },
  { id: 'medio-ambiente', title: 'Medio Ambiente' },
  { id: 'consumo', title: 'Consumo con Sentido' },
];

/** Títulos de categorías para dropdowns (mismo orden). */
export const CATEGORIAS_TITULOS = CIRCULOS_CATEGORIAS.map((c) => c.title);

/** Dado un título de categoría, devuelve el id del círculo (para rutas /circulos/:id). */
export function circuloIdFromTitle(title: string): string {
  const found = CIRCULOS_CATEGORIAS.find(
    (c) => c.title.toLowerCase() === title.toLowerCase()
  );
  return found ? found.id : title;
}

/** Parsea "[Categoría: A, B, C]" y devuelve array de títulos (trim). */
export function parseCategoriesFromDescription(description: string): string[] {
  const match = description.match(/\[Categoría:\s*([^\]]+)\]/i);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
