import type { PreflopStrategy } from '../types';

export const mtt8max40bbHjVs3bet: PreflopStrategy = {
  id: 'mtt-8max-40bb-hj-vs-3bet',
  title: 'MTT 8-max 40bb HJ vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 40,
    position: 'HJ',
    action: 'vs-3bet',
    strategicNote: 'Desde el Hijack con 40bb, al enfrentar un 3-bet, la estrategia es de 4-bet all-in o fold. Con un stack intermedio, no hay mucho espacio para pagar. Se va all-in con un rango de valor premium y algunos bluffs con buenos bloqueadores para equilibrar. El resto del rango de apertura se retira.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 97.0,
    allin: 3.0,
  },
  range: {
    "AA":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "AKs": { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "A5s": { "allin": 70.5, "raise": 0,  "call": 0,  "fold": 29.5 },
    "AKo": { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "KK":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "QQ":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "JJ":  { "allin": 25, "raise": 0,  "call": 0,  "fold": 75 },
    "66":  { "allin": 15.5, "raise": 0,  "call": 0,  "fold": 84.5 }
  },
};
