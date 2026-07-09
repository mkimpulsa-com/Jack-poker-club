import type { PreflopStrategy } from '../types';

export const mtt8max100bbBbVs3bet: PreflopStrategy = {
  id: 'mtt-8max-100bb-bb-vs-3bet',
  title: 'MTT 8-max 100bb BB vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 100,
    position: 'BB',
    action: 'vs-3bet',
    strategicNote: 'Desde la BB, con 100bb, al enfrentar un 3-bet, nos encontramos fuera de posición contra un rango que suele ser fuerte. Nuestra estrategia se polariza: hacemos 4-bet o vamos all-in con nuestras manos más premium (AA, KK, AK) para maximizar valor. Manos con buena jugabilidad postflop pueden pagar, pero con cautela. La mayoría de las manos marginales se retiran para evitar situaciones complejas con un stack profundo y sin la ventaja de la posición.',
  },
  stats: {
    raise: 2.4,
    call: 0,
    fold: 96.9,
    allin: 0.7,
  },
  range: {
    "AA": { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "AKs": { "allin": 45.5, "raise": 54.5, "call": 0, "fold": 0 },
    "AQs": { "allin": 0, "raise": 52.5, "call": 0, "fold": 47.5 },
    "AJs": { "allin": 0, "raise": 16, "call": 0, "fold": 84 },
    "ATs": { "allin": 0, "raise": 5.5, "call": 0, "fold": 94.5 },
    "A5s": { "allin": 0, "raise": 16, "call": 0, "fold": 84 },
    "AKo": { "allin": 36.5, "raise": 63.5, "call": 0, "fold": 0 },
    "KK": { "allin": 40.5, "raise": 59.5, "call": 0, "fold": 0 },
    "QQ": { "allin": 2.5, "raise": 97.5, "call": 0, "fold": 0 },
    "JJ": { "allin": 0, "raise": 47.5, "call": 0, "fold": 52.5 },
    "TT": { "allin": 0, "raise": 8.5, "call": 0, "fold": 91.5 }
  },
};
