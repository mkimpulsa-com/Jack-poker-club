'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, BookText, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Category = 'all' | 'acciones' | 'posiciones' | 'estrategia' | 'torneos' | 'cash' | 'mental' | 'bankroll';

type Term = {
  term: string;
  title: string;
  category: Category;
  categoryLabel: string;
  description: string;
  example: string;
};

const TERMS: Term[] = [
  { term: "all in all-in", title: "All-In", category: "acciones", categoryLabel: "Acción", description: "Apostar todas las fichas disponibles en una mano.", example: "Con 10 ciegas y A-K, el jugador fue all-in preflop." },
  { term: "call pagar", title: "Call", category: "acciones", categoryLabel: "Acción", description: "Igualar la apuesta realizada por otro jugador para continuar en la mano.", example: "El rival apostó 5 BB y decidiste pagar." },
  { term: "check pasar", title: "Check", category: "acciones", categoryLabel: "Acción", description: "Pasar la acción sin apostar cuando nadie apostó antes en esa ronda.", example: "En el flop nadie apostó, entonces hiciste check." },
  { term: "fold foldear retirarse", title: "Fold", category: "acciones", categoryLabel: "Acción", description: "Retirarse de la mano y abandonar cualquier posibilidad de ganar el bote.", example: "Tenías una mano débil y decidiste foldear ante una apuesta fuerte." },
  { term: "raise subir aumento", title: "Raise", category: "acciones", categoryLabel: "Acción", description: "Aumentar la apuesta previa de otro jugador.", example: "Un jugador apostó 2 BB y vos subiste a 7 BB." },
  { term: "3bet three bet resubida", title: "3-Bet", category: "acciones", categoryLabel: "Acción", description: "Resubida preflop después de que un jugador ya abrió la mano con un raise.", example: "BTN abrió y SB hizo 3-bet." },
  { term: "cbet continuation bet apuesta continuacion", title: "C-Bet", category: "acciones", categoryLabel: "Acción", description: "Apuesta de continuación realizada por el jugador que fue agresor en la calle anterior.", example: "Abriste preflop y apostaste en el flop." },
  { term: "donk bet apuesta de cara", title: "Donk Bet", category: "acciones", categoryLabel: "Acción", description: "Apostar fuera de posición contra el agresor de la calle anterior.", example: "Pagaste preflop en BB y saliste apostando en el flop." },
  
  { term: "button boton dealer btn", title: "Button / BTN", category: "posiciones", categoryLabel: "Posición", description: "Posición del repartidor. Es la mejor posición porque actúa último postflop.", example: "Desde BTN podés abrir más manos por la ventaja posicional." },
  { term: "small blind sb ciega chica", title: "Small Blind / SB", category: "posiciones", categoryLabel: "Posición", description: "Ciega pequeña. Pone media ciega obligatoria y suele jugar fuera de posición.", example: "Desde SB hay que ser más cuidadoso porque BB habla después." },
  { term: "big blind bb ciega grande", title: "Big Blind / BB", category: "posiciones", categoryLabel: "Posición", description: "Ciega grande. Es la apuesta obligatoria mayor antes del inicio de la mano.", example: "Defendiste BB contra un min-raise del botón." },
  { term: "under the gun utg primera posicion", title: "UTG", category: "posiciones", categoryLabel: "Posición", description: "Under The Gun. Primera posición en hablar preflop en mesas full ring.", example: "Desde UTG se recomienda abrir un rango más fuerte." },
  { term: "cutoff co posicion antes boton", title: "Cutoff / CO", category: "posiciones", categoryLabel: "Posición", description: "Posición ubicada justo antes del botón. Es una de las posiciones más rentables.", example: "En CO podés intentar robar las ciegas con más frecuencia." },
  { term: "hijack hj posicion", title: "Hijack / HJ", category: "posiciones", categoryLabel: "Posición", description: "Posición anterior al cutoff. Permite abrir un rango intermedio.", example: "Desde HJ abriste AJs porque la mesa venía tight." },

  { term: "equity probabilidad ganar", title: "Equity", category: "estrategia", categoryLabel: "Estrategia", description: "Porcentaje estimado de chances que tiene una mano de ganar el bote.", example: "Un proyecto de color puede tener buena equity contra una pareja." },
  { term: "ev expected value valor esperado", title: "EV", category: "estrategia", categoryLabel: "Estrategia", description: "Valor esperado de una decisión a largo plazo. Una jugada puede perder hoy, pero ser rentable en el tiempo.", example: "Pagar un all-in puede ser EV+ aunque pierdas esa mano." },
  { term: "range rango manos", title: "Range", category: "estrategia", categoryLabel: "Estrategia", description: "Conjunto de manos posibles que puede tener un jugador según sus acciones.", example: "El rango de UTG suele ser más fuerte que el rango de BTN." },
  { term: "bluff farol", title: "Bluff", category: "estrategia", categoryLabel: "Estrategia", description: "Apostar o subir con una mano débil intentando que el rival foldee una mano mejor.", example: "Apostaste fuerte en river representando color." },
  { term: "semi bluff semifarol proyecto", title: "Semi-Bluff", category: "estrategia", categoryLabel: "Estrategia", description: "Bluff realizado con una mano que todavía puede mejorar en calles futuras.", example: "Apostaste con proyecto de escalera y color." },
  { term: "value bet apuesta valor", title: "Value Bet", category: "estrategia", categoryLabel: "Estrategia", description: "Apuesta realizada con una mano fuerte buscando que manos peores paguen.", example: "Apostaste river con top pair para cobrar de una segunda pareja." },
  { term: "pot odds odds bote", title: "Pot Odds", category: "estrategia", categoryLabel: "Estrategia", description: "Relación entre el tamaño del bote y lo que tenés que pagar para continuar.", example: "Si el bote es grande y el call es chico, podés tener buenas pot odds." },
  { term: "outs cartas mejoran", title: "Outs", category: "estrategia", categoryLabel: "Estrategia", description: "Cartas que pueden mejorar tu mano y probablemente darte la victoria.", example: "Con proyecto de color normalmente tenés 9 outs." },
  { term: "nuts mejor mano posible", title: "Nuts", category: "estrategia", categoryLabel: "Estrategia", description: "La mejor mano posible en una situación determinada.", example: "Tenías A♠ K♠ en un board con tres picas y formaste las nuts." },
  { term: "kicker carta desempate", title: "Kicker", category: "estrategia", categoryLabel: "Estrategia", description: "Carta secundaria que puede definir el ganador cuando dos jugadores tienen una mano similar.", example: "Ambos tenían top pair, pero tu kicker era mejor." },
  { term: "blocker bloqueador carta", title: "Blocker", category: "estrategia", categoryLabel: "Estrategia", description: "Carta que reduce las combinaciones fuertes que puede tener el rival.", example: "Tener el As de picas bloquea algunos colores fuertes del rival." },
  { term: "squeeze resubida squeeze play", title: "Squeeze", category: "estrategia", categoryLabel: "Estrategia", description: "Resubida fuerte después de un raise y uno o más calls.", example: "CO abrió, BTN pagó y vos hiciste squeeze desde SB." },
  { term: "steal robo ciegas", title: "Steal", category: "estrategia", categoryLabel: "Estrategia", description: "Intento de robar las ciegas abriendo desde posiciones finales.", example: "Abriste desde BTN con una mano media para robar SB y BB." },
  { term: "limp limpear pagar ciega", title: "Limp", category: "estrategia", categoryLabel: "Estrategia", description: "Entrar a la mano pagando solo la ciega grande en lugar de subir.", example: "El jugador limpeó desde UTG." },
  { term: "open raise apertura", title: "Open Raise", category: "estrategia", categoryLabel: "Estrategia", description: "Primera subida preflop cuando nadie abrió antes.", example: "Todos foldearon hasta vos y abriste a 2.5 BB." },
  { term: "suited connector conectores suited", title: "Suited Connector", category: "estrategia", categoryLabel: "Estrategia", description: "Dos cartas consecutivas del mismo palo.", example: "8♠ 9♠ es un suited connector." },
  { term: "gutshot escalera interna", title: "Gutshot", category: "estrategia", categoryLabel: "Estrategia", description: "Proyecto de escalera interna que necesita una carta específica para completarse.", example: "Tenés 8-9 y el board es 6-7-K: un 10 completa escalera." },
  { term: "backdoor proyecto runner runner", title: "Backdoor", category: "estrategia", categoryLabel: "Estrategia", description: "Proyecto que necesita mejorar en turn y river para completarse.", example: "Tenés dos cartas de picas y solo una pica en flop." },
  { term: "showdown mostrar cartas final", title: "Showdown", category: "estrategia", categoryLabel: "Estrategia", description: "Momento final de la mano donde los jugadores muestran sus cartas para definir el ganador.", example: "Llegaron al river, nadie apostó más y fueron al showdown." },

  { term: "buy in entrada inscripcion", title: "Buy-In", category: "torneos", categoryLabel: "Torneos", description: "Costo de entrada para participar en un torneo o mesa.", example: "El torneo tiene buy-in de $10." },
  { term: "add on addon recompra extra", title: "Add-On", category: "torneos", categoryLabel: "Torneos", description: "Compra adicional de fichas permitida en determinados torneos.", example: "Al finalizar el registro tardío, hiciste add-on." },
  { term: "rebuy recompra", title: "Rebuy", category: "torneos", categoryLabel: "Torneos", description: "Recompra de fichas luego de perder el stack o quedar con pocas fichas, si el torneo lo permite.", example: "Perdiste temprano y usaste un rebuy." },
  { term: "bubble burbuja premios", title: "Bubble", category: "torneos", categoryLabel: "Torneos", description: "Momento justo antes de entrar en premios.", example: "Quedan 16 jugadores y cobran 15: están en burbuja." },
  { term: "itm in the money premios", title: "ITM", category: "torneos", categoryLabel: "Torneos", description: "In The Money. Significa que el jugador ya entró en premios.", example: "Terminaste 12° y el torneo pagaba 20 puestos: quedaste ITM." },
  { term: "icm independent chip model", title: "ICM", category: "torneos", categoryLabel: "Torneos", description: "Modelo que estima el valor real de las fichas según premios, stacks y jugadores restantes.", example: "En mesa final, ICM puede hacer que foldear sea mejor que pagar." },
  { term: "satellite satelite clasificacion", title: "Satélite", category: "torneos", categoryLabel: "Torneos", description: "Torneo que entrega entradas para otro evento más grande.", example: "Ganaste un satélite y clasificaste al torneo principal." },
  { term: "mtt multi table tournament", title: "MTT", category: "torneos", categoryLabel: "Torneos", description: "Multi Table Tournament. Torneo con múltiples mesas y muchos jugadores.", example: "Jugaste un MTT con 500 participantes." },
  { term: "freeroll gratis free roll", title: "Freeroll", category: "torneos", categoryLabel: "Torneos", description: "Torneo gratuito que puede entregar premios reales o entradas a otros eventos.", example: "Entraste gratis a un freeroll con premio garantizado." },

  { term: "cash game mesa dinero real", title: "Cash Game", category: "cash", categoryLabel: "Cash", description: "Modalidad donde las fichas representan dinero real y podés entrar o salir cuando quieras.", example: "Jugaste NL25 cash durante 2 horas." },
  { term: "rake comision sala", title: "Rake", category: "cash", categoryLabel: "Cash", description: "Comisión que cobra la sala o club por organizar la partida.", example: "El club cobra rake por cada bote jugado." },
  { term: "rakeback devolucion rake", title: "Rakeback", category: "cash", categoryLabel: "Cash", description: "Devolución parcial del rake pagado por el jugador.", example: "Esta semana recibiste $25 de rakeback." },
  { term: "bb100 winrate big blinds", title: "bb/100", category: "cash", categoryLabel: "Cash", description: "Métrica de winrate en cash. Indica cuántas ciegas grandes ganás cada 100 manos.", example: "Ganar 5 bb/100 es un buen resultado en muchos niveles." },
  { term: "straddle apuesta ciega opcional", title: "Straddle", category: "cash", categoryLabel: "Cash", description: "Apuesta opcional antes de recibir cartas, normalmente el doble de la ciega grande.", example: "En vivo, el jugador UTG puso straddle." },

  { term: "bankroll banca gestion", title: "Bankroll", category: "bankroll", categoryLabel: "Bankroll", description: "Dinero destinado exclusivamente para jugar poker.", example: "Tenés $500 separados solo para tu bankroll de poker." },
  { term: "abi average buy in promedio entrada", title: "ABI", category: "bankroll", categoryLabel: "Bankroll", description: "Average Buy-In. Promedio de entrada de los torneos jugados.", example: "Si jugás torneos de $5, $10 y $15, tu ABI ronda $10." },
  { term: "roi return investment retorno inversion", title: "ROI", category: "bankroll", categoryLabel: "Bankroll", description: "Retorno sobre la inversión. Mide cuánto ganás o perdés en relación a lo invertido.", example: "Invertiste $100 y ganaste $20: tu ROI es 20%." },
  { term: "stop loss limite perdida", title: "Stop-Loss", category: "bankroll", categoryLabel: "Bankroll", description: "Límite de pérdida definido antes de jugar para evitar perder el control.", example: "Si perdés 4 buy-ins, cerrás la sesión." },
  { term: "shot taking subir nivel", title: "Shot Taking", category: "bankroll", categoryLabel: "Bankroll", description: "Intentar jugar un nivel superior de forma controlada cuando el bankroll lo permite.", example: "Tomaste un shot a NL50 con reglas claras de bajada." },

  { term: "tilt enojo descontrol emocional", title: "Tilt", category: "mental", categoryLabel: "Mental", description: "Estado emocional negativo que lleva a tomar malas decisiones.", example: "Después de un bad beat, empezaste a pagar de más por enojo." },
  { term: "variance varianza resultados", title: "Varianza", category: "mental", categoryLabel: "Mental", description: "Diferencia natural entre el resultado esperado y el resultado real en el corto plazo.", example: "Jugaste bien, pero perdiste varios all-ins favorables." },
  { term: "bad beat golpe mala suerte", title: "Bad Beat", category: "mental", categoryLabel: "Mental", description: "Perder una mano donde eras claro favorito.", example: "Fuiste all-in con AA y perdiste contra 72o." },
  { term: "cooler mano inevitable", title: "Cooler", category: "mental", categoryLabel: "Mental", description: "Situación fuerte contra fuerte donde es muy difícil evitar perder muchas fichas.", example: "Set contra set en flop seco." },
  { term: "a game mejor juego", title: "A-Game", category: "mental", categoryLabel: "Mental", description: "Tu mejor nivel de juego, cuando estás concentrado, disciplinado y tomando buenas decisiones.", example: "Jugaste 80% de la sesión en A-Game." }
];

const FILTERS: { id: Category; label: string }[] = [
  { id: 'all', label: 'Todos los términos' },
  { id: 'acciones', label: 'Acciones' },
  { id: 'posiciones', label: 'Posiciones' },
  { id: 'estrategia', label: 'Estrategia' },
  { id: 'torneos', label: 'Torneos' },
  { id: 'cash', label: 'Cash Game' },
  { id: 'mental', label: 'Mental Game' },
  { id: 'bankroll', label: 'Bankroll' }
];

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function DictionaryPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Category>('all');

  const filteredTerms = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    return TERMS.filter(term => {
      const searchStr = normalizeText(term.term + " " + term.title);
      const matchesSearch = searchStr.includes(normalizedSearch);
      const matchesFilter = activeFilter === 'all' || term.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <section className="relative overflow-hidden rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-8 md:p-12 shadow-sm">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-primary font-bold tracking-wider text-sm uppercase mb-4">
              El Nido Poker · Glosario profesional
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Diccionario de Poker
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-3xl">
              Tu glosario de referencia para entender los términos más importantes del poker: 
              posiciones, acciones, estrategia, torneos, cash games, mental game y gestión de bankroll.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
          
          <aside className="lg:sticky lg:top-24 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-2">Buscar términos</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
              Escribí una palabra o filtrá por categoría para encontrar rápidamente el concepto que necesitás.
            </p>

            <div className="relative mb-6">
              <Input 
                type="text" 
                placeholder="Buscar: equity, bluff, bankroll..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            </div>

            <div className="flex flex-col gap-2">
              {FILTERS.map(filter => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'default' : 'ghost'}
                  className={`justify-start h-11 px-4 rounded-xl font-semibold transition-all ${
                    activeFilter === filter.id 
                      ? 'shadow-md bg-primary text-primary-foreground' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Glosario principal</h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Conceptos explicados de forma simple, práctica y útil.
                </p>
              </div>
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20 whitespace-nowrap">
                {filteredTerms.length} {filteredTerms.length === 1 ? 'término' : 'términos'}
              </div>
            </div>

            {filteredTerms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTerms.map((term, i) => (
                  <motion.article 
                    key={term.term}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="group relative flex flex-col p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 hover:border-primary/50 transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <h3 className="font-bold text-lg leading-tight">{term.title}</h3>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 whitespace-nowrap">
                        {term.categoryLabel}
                      </span>
                    </div>
                    
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 flex-grow relative z-10 leading-relaxed">
                      {term.description}
                    </p>
                    
                    <div className="mt-auto p-3 rounded-xl bg-neutral-200/50 dark:bg-neutral-900 border border-neutral-300/50 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 relative z-10">
                      <strong className="text-primary">Ejemplo:</strong> {term.example}
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl bg-neutral-50 dark:bg-neutral-950/30">
                <p className="text-neutral-500 font-medium">No encontramos términos con esa búsqueda.</p>
                <p className="text-neutral-400 text-sm mt-1">Probá con otra palabra o categoría.</p>
              </div>
            )}
          </section>

        </div>

      </div>
    </div>
  );
}
