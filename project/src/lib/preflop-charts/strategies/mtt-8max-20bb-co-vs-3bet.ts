import type { PreflopStrategy } from '../types';

export const mtt8max20bbCoVs3bet: PreflopStrategy = {
  id: 'mtt-8max-20bb-co-vs-3bet',
  title: 'MTT 8-max 20bb CO vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 20,
    position: 'CO',
    action: 'vs-3bet',
    strategicNote: "Con un stack de 20bb desde CO, al enfrentar un 3-bet, la estrategia es casi exclusivamente de 4-bet all-in o fold. Dado el bajo SPR (Stack-to-Pot Ratio), no hay espacio para pagar. Se va all-in con un rango de valor muy fuerte (pares altos y broadways fuertes) y algunos semi-bluffs para maximizar la equity y la fold equity. El resto del rango de apertura se retira.",
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 96.4,
    allin: 3.6,
  },
  range: {
    "AA":  { "allin": 100 },
    "AKs": { "allin": 100 },
    "AQs": { "allin": 100 },
    "ATs": { "allin": 43.5, "fold": 56.5 },
    "AKo": { "allin": 100 },
    "KK":  { "allin": 100 },
    "KQs": { "allin": 40.5, "fold": 59.5 },
    "QQ":  { "allin": 100 },
    "JJ":  { "allin": 100 },
    "TT":  { "allin": 16, "fold": 84 }
  },
};
