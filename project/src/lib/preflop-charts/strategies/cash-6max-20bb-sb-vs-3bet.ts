import type { PreflopStrategy } from '../types';

export const cash6max20bbSbVs3bet: PreflopStrategy = {
  id: 'cash-6max-20bb-sb-vs-3bet',
  title: 'Cash 6-max 20bb SB vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 20,
    position: 'SB',
    action: 'vs-3bet',
    strategicNote: 'Desde la SB, con 20bb, al enfrentar un 3-bet, la estrategia es muy clara: 4-bet all-in o fold. No hay espacio para pagar. Este rango muestra las manos con las que vamos all-in por valor. Cualquier otra mano que no esté en esta tabla debería ser retirada para evitar situaciones complejas y desfavorables fuera de posición con un stack corto.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 95.7,
    allin: 4.3,
  },
  range: {
    "AA": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AKs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AJs": { "allin": 65, "raise": 0, "call": 0, "fold": 35 },
    "AKo": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KK": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "QQ": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "JJ": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "TT": { "allin": 100, "raise": 0, "call": 0, "fold": 0 }
  },
};
