import type { PreflopStrategy } from '../types';

export const cash6max40bbBbVs3bet: PreflopStrategy = {
  id: 'cash-6max-40bb-bb-vs-3bet',
  title: 'Cash 6-max 40bb BB vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 40,
    position: 'BB',
    action: 'vs-3bet',
    strategicNote: 'Desde la BB con 40bb, al enfrentar un 3-bet, nuestra estrategia se vuelve crítica. Este rango define cómo responder: 4-bet/all-in por valor con las manos más fuertes, pagar con manos que tienen buenas pot odds y potencial, y retirarse con las manos más débiles para evitar situaciones desfavorables.',
  },
  stats: {
    raise: 39.3,
    call: 0.1,
    fold: 31.8,
    allin: 28.8,
  },
  range: {
    "AA":  { "allin": 0,   "raise": 100,  "call": 0,    "fold": 0 },
    "AKs": { "allin": 46,  "raise": 54,   "call": 0,    "fold": 0 },
    "AQs": { "allin": 0,   "raise": 100,  "call": 0,    "fold": 0 },
    "AJs": { "allin": 0,   "raise": 42.5, "call": 1.5,  "fold": 56 },
    "AKo": { "allin": 99,  "raise": 1,    "call": 0,    "fold": 0 },
    "KK":  { "allin": 28,  "raise": 72,   "call": 0,    "fold": 0 },
    "KQs": { "allin": 0,   "raise": 76,   "call": 0,    "fold": 24 },
    "AQo": { "allin": 0,   "raise": 10,   "call": 0,    "fold": 90 },
    "QQ":  { "allin": 100, "raise": 0,    "call": 0,    "fold": 0 },
    "JJ":  { "allin": 7.5, "raise": 92.5, "call": 0,    "fold": 0 },
    "TT":  { "allin": 0,   "raise": 26.37,"call": 0.50, "fold": 73.13 },
    "99":  { "allin": 0,   "raise": 3.5,  "call": 0,    "fold": 96.5 }
  },
};
