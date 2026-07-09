import type { PreflopStrategy } from '../types';

export const cash6max20bbUtgVs3bet: PreflopStrategy = {
  id: 'cash-6max-20bb-utg-vs-3bet',
  title: 'Cash 6-max 20bb UTG vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 20,
    position: 'UTG',
    action: 'vs-3bet',
    strategicNote: "Desde UTG con 20bb, al enfrentar un 3-bet, la estrategia es de 4-bet all-in o fold. No hay espacio para pagar. Se va all-in con un rango de valor muy fuerte. El resto se retira para evitar situaciones dominadas fuera de posición con un stack corto.",
  },
  stats: {
    raise: 0,
    call: 10.2,
    fold: 60.6,
    allin: 29.2,
  },
  range: {
    "AA":  { "allin": 95.5, "call": 4.5 },
    "AKs": { "allin": 100 },
    "AQs": { "allin": 86, "call": 14 },
    "AJs": { "call": 100 },
    "ATs": { "call": 58.5, "fold": 41.5 },
    "A5s": { "call": 34.5, "fold": 65.5 },
    "A4s": { "call": 23.5, "fold": 76.5 },
    "AKo": { "allin": 100 },
    "KK":  { "allin": 100 },
    "KQs": { "call": 100 },
    "KJs": { "allin": 80.5, "call": 19.5 },
    "AQo": { "allin": 80, "call": 20 },
    "QQ":  { "allin": 100 },
    "JJ":  { "allin": 100 },
    "JTs": { "call": 22, "fold": 78 },
    "TT":  { "allin": 100 },
    "T9s": { "call": 14, "fold": 86 },
    "99":  { "allin": 99, "call": 1 },
    "88":  { "allin": 46, "call": 54 },
    "77":  { "allin": 33, "call": 67 }
  },
};
