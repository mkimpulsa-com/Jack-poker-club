import type { PreflopStrategy } from '../types';

export const cash6max100bbBbVs3bet: PreflopStrategy = {
  id: 'cash-6max-100bb-bb-vs-3bet',
  title: 'Cash 6-max 100bb BB vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 100,
    position: 'BB',
    action: 'vs-3bet',
    strategicNote: "Desde la BB, al enfrentar un 3-bet, nuestra posición es desfavorable. Sin embargo, como ya hemos invertido una ciega, obtenemos buenas pot odds para pagar. La estrategia se polariza: hacemos 4-bet o vamos all-in con nuestras manos más fuertes (AA, KK, AKs) por valor y con algunos bluffs (como A5s) para equilibrar. Con muchas manos especulativas y pares medios, optamos por el call para ver un flop, aprovechando las odds. El resto se foldea.",
  },
  stats: {
    raise: 2.9,
    call: 0,
    fold: 96.5,
    allin: 0.6,
  },
  range: {
    "AA":  { "allin": 0,    "raise": 100,  "call": 0, "fold": 0 },
    "AKs": { "allin": 55.5, "raise": 44.5, "call": 0, "fold": 0 },
    "AQs": { "allin": 0,    "raise": 99.5, "call": 0, "fold": 0.5 },
    "A5s": { "allin": 0,    "raise": 23,   "call": 0, "fold": 77 },
    "AKo": { "allin": 26,   "raise": 74,   "call": 0, "fold": 0 },
    "KK":  { "allin": 32,   "raise": 68,   "call": 0, "fold": 0 },
    "KQs": { "allin": 0,    "raise": 15,   "call": 0, "fold": 85 },
    "KJs": { "allin": 0,    "raise": 19.5, "call": 0, "fold": 80.5 },
    "KTs": { "allin": 0,    "raise": 8,    "call": 0, "fold": 92 },
    "QQ":  { "allin": 1.5,  "raise": 98.5, "call": 0, "fold": 0 },
    "JJ":  { "allin": 0,    "raise": 49.5, "call": 0, "fold": 50.5 },
    "TT":  { "allin": 0,    "raise": 16,   "call": 0, "fold": 84 },
    "99":  { "allin": 0,    "raise": 9.5,  "call": 0, "fold": 90.5 }
  },
};
