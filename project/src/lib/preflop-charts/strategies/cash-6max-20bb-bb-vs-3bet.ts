import type { PreflopStrategy } from '../types';

export const cash6max20bbBbVs3bet: PreflopStrategy = {
  id: 'cash-6max-20bb-bb-vs-3bet',
  title: 'Cash 6-max 20bb BB vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 20,
    position: 'BB',
    action: 'vs-3bet',
    strategicNote: 'Con un stack corto de 20bb desde la BB, al enfrentar un 3-bet, tu rango se vuelve extremadamente polarizado hacia el valor. La estrategia es casi exclusivamente 4-bet all-in o fold. Este rango muestra las manos con las que vas all-in para maximizar tu equity. Manos fuera de este rango deben ser foldeadas, ya que pagar fuera de posición con un SPR bajo es una situación muy desfavorable.',
  },
  stats: {
    raise: 0,
    call: 0.0,
    fold: 95.7,
    allin: 4.3,
  },
  range: {
    "AA":  { "allin": 98, "raise": 0, "call": 2, "fold": 0 },
    "AKs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AJs": { "allin": 85, "raise": 0, "call": 0, "fold": 15 },
    "AKo": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KK":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "QQ":  { "allin": 100,  "raise": 0, "call": 0, "fold": 0 },
    "JJ":  { "allin": 100,  "raise": 0, "call": 0, "fold": 0 },
    "TT":  { "allin": 100,   "raise": 0, "call": 0, "fold": 0 }
  },
};
