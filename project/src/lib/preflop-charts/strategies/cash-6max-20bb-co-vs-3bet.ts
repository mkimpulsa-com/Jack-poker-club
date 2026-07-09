import type { PreflopStrategy } from '../types';

export const cash6max20bbCoVs3bet: PreflopStrategy = {
  id: 'cash-6max-20bb-co-vs-3bet',
  title: 'Cash 6-max 20bb CO vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 20,
    position: 'CO',
    action: 'vs-3bet',
    strategicNote: "Con un stack de 20bb desde CO, al enfrentar un 3-bet, la estrategia es casi exclusivamente de 4-bet all-in o fold. Dado el bajo SPR (Stack-to-Pot Ratio), no hay espacio para pagar. Se va all-in con un rango de valor muy fuerte (pares altos y broadways fuertes) para maximizar la equity, y el resto del rango de apertura se retira.",
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 96.2,
    allin: 3.8,
  },
  range: {
    "AA":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AKs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AKo": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KK":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KQs": { "allin": 54, "raise": 0, "call": 0, "fold": 46 },
    "QQ":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "JJ":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "TT":  { "allin": 75, "raise": 0, "call": 0, "fold": 25 }
  },
};
