import type { PreflopStrategy } from '../types';

export const cash6max40bbCoVs3bet: PreflopStrategy = {
  id: 'cash-6max-40bb-co-vs-3bet',
  title: 'Cash 6-max 40bb CO vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 40,
    position: 'CO',
    action: 'vs-3bet',
    strategicNote: "Desde CO, al enfrentar un 3-bet con 40bb, nuestro rango se vuelve muy ajustado y agresivo. La estrategia principal es ir all-in por valor con las manos más fuertes. El call es raramente una opción debido a la posición y el bajo SPR. Las manos que no son lo suficientemente fuertes para ir all-in o 4-bet de farol se foldean.",
  },
  stats: {
    raise: 2.4,
    call: 0,
    fold: 96.2,
    allin: 1.4,
  },
  range: {
    "AA":  { "allin": 0,   "raise": 99.5, "call": 0.5, "fold": 0 },
    "AKs": { "allin": 15.5, "raise": 84.5, "call": 0,   "fold": 0 },
    "AQs": { "allin": 0,   "raise": 99.5, "call": 0.5, "fold": 0 },
    "AKo": { "allin": 88,  "raise": 12,   "call": 0,   "fold": 0 },
    "KK":  { "allin": 15,  "raise": 85,   "call": 0,   "fold": 0 },
    "KQs": { "allin": 0,   "raise": 72.5, "call": 0,   "fold": 27.5 },
    "KJs": { "allin": 0,   "raise": 62,   "call": 2,   "fold": 36 },
    "AQo": { "allin": 0,   "raise": 9.5,  "call": 0,   "fold": 90.5 },
    "QQ":  { "allin": 100, "raise": 0,    "call": 0,   "fold": 0 },
    "JJ":  { "allin": 3.5, "raise": 95,   "call": 1.5, "fold": 0 }
  },
};
