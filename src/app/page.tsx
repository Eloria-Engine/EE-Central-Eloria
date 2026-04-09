/**
 * central.eloria.paris — Hub central del ecosistema Eloria
 *
 * Página principal: muestra todos los productos activos,
 * su estado y links directos.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eloria Central — Ecosistema de Soluciones',
  description: 'Hub central del ecosistema Eloria. Accede a todos los sistemas y herramientas.',
};

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  status: 'active' | 'building' | 'planned';
  category: 'motor' | 'client' | 'tool';
}

const PRODUCTS: Product[] = [
  {
    id: 'master-dashboard',
    name: 'Eloria Master Dashboard',
    description: 'Panel de control del motor — agentes, skills, pipelines y métricas del ecosistema.',
    url: 'https://app.eloria.paris',
    status: 'active',
    category: 'motor',
  },
  {
    id: 'monte-sion-sge',
    name: 'Monte Sion — Gestión Escolar',
    description: 'Sistema de gestión escolar: alumnos, pagos, notificaciones y reportes.',
    url: 'https://monte-sion-school.eloria.paris',
    status: 'active',
    category: 'client',
  },
  {
    id: 'factoria',
    name: 'FactorIA',
    description: 'Fábrica de proyectos IA — genera proyectos listos para producción.',
    url: '#',
    status: 'building',
    category: 'tool',
  },
];

const STATUS_LABEL: Record<Product['status'], string> = {
  active:   'Activo',
  building: 'En construcción',
  planned:  'Planificado',
};

const STATUS_COLOR: Record<Product['status'], string> = {
  active:   'bg-emerald-500',
  building: 'bg-amber-400',
  planned:  'bg-slate-400',
};

const CATEGORY_LABEL: Record<Product['category'], string> = {
  motor:  'Motor',
  client: 'Cliente',
  tool:   'Herramienta',
};

export default function HomePage() {
  const activeCount = PRODUCTS.filter(p => p.status === 'active').length;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold">
              E
            </div>
            <span className="font-semibold text-white">Eloria Central</span>
          </div>
          <span className="text-xs text-white/40">{activeCount} productos activos</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Ecosistema Eloria
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          Motor de orquestación IA y los sistemas que genera. Cada producto nace aquí y vive de forma independiente.
        </p>
      </section>

      {/* Products grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map(product => (
            <a
              key={product.id}
              href={product.status === 'active' ? product.url : undefined}
              target={product.status === 'active' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`group block rounded-xl border border-white/10 bg-white/5 p-5 transition-all duration-200 ${
                product.status === 'active'
                  ? 'hover:border-violet-500/50 hover:bg-white/8 cursor-pointer'
                  : 'opacity-60 cursor-default'
              }`}
            >
              {/* Status dot + category */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/40 font-medium">
                  {CATEGORY_LABEL[product.category]}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/50">
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLOR[product.status]}`} />
                  {STATUS_LABEL[product.status]}
                </span>
              </div>

              {/* Name + description */}
              <h2 className="font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">
                {product.name}
              </h2>
              <p className="text-sm text-white/50 leading-relaxed">
                {product.description}
              </p>

              {/* Arrow for active */}
              {product.status === 'active' && (
                <div className="mt-4 flex items-center gap-1 text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Abrir <span>→</span>
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/30">
        Eloria Engine v2.5.0 — construido por Isaac con Claude
      </footer>
    </main>
  );
}
