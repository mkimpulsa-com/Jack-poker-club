import type { PreflopStrategy } from '../types';

export const mtt8max100bbHjVs3bet: PreflopStrategy = {
  id: 'mtt-8max-100bb-hj-vs-3bet',
  title: 'MTT 8-max 100bb HJ vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 100,
    position: 'HJ',
    action: 'vs-3bet',
    strategicNote: 'Desde el Hijack (HJ) con un stack de 100bb, al enfrentar un 3-bet, la estrategia debe ser muy selectiva. Se hace 4-bet por valor con un rango de manos premium. Los 4-bet de farol se hacen con manos que tienen buenos bloqueadores. El resto del rango de apertura se retira para evitar jugar pozos grandes fuera de posición.',
  },
  stats: {
    raise: 2.3,
    call: 0,
    fold: 97.5,
    allin: 0.2,
  },
  range: {
    "AA":  { "allin": 0,   "raise": 100,  "call": 0, "fold": 0 },
    "AKs": { "allin": 53.5,"raise": 46.5, "call": 0, "fold": 0 },
    "AQs": { "allin": 0,   "raise": 7,    "call": 0, "fold": 93 },
    "AJs": { "allin": 0,   "raise": 6,    "call": 0, "fold": 94 },
    "ATs": { "allin": 0,   "raise": 38,   "call": 0, "fold": 62 },
    "A9s": { "allin": 0,   "raise": 14,   "call": 0, "fold": 86 },
    "A5s": { "allin": 0,   "raise": 22,   "call": 0, "fold": 78 },
    "AKo": { "allin": 0,   "raise": 77.5, "call": 0, "fold": 22.5 },
    "KK":  { "allin": 13,  "raise": 87,   "call": 0, "fold": 0 },
    "QQ":  { "allin": 0,   "raise": 76.5, "call": 0, "fold": 23.5 },
    "JJ":  { "allin": 0,   "raise": 10.5, "call": 0, "fold": 89.5 }
  },
};
