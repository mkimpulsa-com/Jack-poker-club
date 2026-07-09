import type { PreflopStrategy } from '../types';

export const cash6max100bbSbVs3bet: PreflopStrategy = {
  id: 'cash-6max-100bb-sb-vs-3bet',
  title: 'Cash 6-max 100bb SB vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 100,
    position: 'SB',
    action: 'vs-3bet',
    strategicNote: 'Desde la Ciega Pequeña (SB) y enfrentando un 3-bet, nuestra estrategia se vuelve muy polarizada. Jugamos all-in o 4-bet con nuestras manos más fuertes por valor (AA, KK, AKs) y como farol con bloqueadores fuertes (A5s). La mayoría de las manos se retiran porque estaríamos jugando fuera de posición en un pozo grande, lo cual es una desventaja significativa.',
  },
  stats: {
    raise: 2.7,
    call: 0,
    fold: 96.9,
    allin: 0.4,
  },
  range: {
    "AA":  { "allin": 0,    "raise": 100,  "call": 0, "fold": 0 },
    "AKs": { "allin": 50,   "raise": 50,   "call": 0, "fold": 0 },
    "AQs": { "allin": 0,    "raise": 55.5, "call": 0, "fold": 44.5 },
    "A5s": { "allin": 0,    "raise": 27,   "call": 0, "fold": 73 },
    "AKo": { "allin": 16.5, "raise": 83.5, "call": 0, "fold": 0 },
    "KK":  { "allin": 23,   "raise": 77,   "call": 0, "fold": 0 },
    "KQs": { "allin": 0,    "raise": 10.5, "call": 0, "fold": 89.5 },
    "KJs": { "allin": 0,    "raise": 3,    "call": 0, "fold": 97 },
    "KTs": { "allin": 0,    "raise": 6,    "call": 0, "fold": 94 },
    "QQ":  { "allin": 1,    "raise": 99,   "call": 0, "fold": 0 },
    "JJ":  { "allin": 0,    "raise": 38,   "call": 0, "fold": 62 },
    "TT":  { "allin": 0,    "raise": 17.5, "call": 0, "fold": 82.5 },
    "99":  { "allin": 0,    "raise": 6.5,  "call": 0, "fold": 93.5 }
  },
};
