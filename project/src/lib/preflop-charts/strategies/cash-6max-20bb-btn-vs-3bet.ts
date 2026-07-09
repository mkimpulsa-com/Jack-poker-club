import type { PreflopStrategy } from '../types';

export const cash6max20bbBtnVs3bet: PreflopStrategy = {
  id: 'cash-6max-20bb-btn-vs-3bet',
  title: 'Cash 6-max 20bb BTN vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 20,
    position: 'BTN',
    action: 'vs-3bet',
    strategicNote: 'Desde el BTN con un stack corto de 20bb, al enfrentar un 3-bet, la estrategia se simplifica a 4-bet all-in o fold. El rango de 4-bet es por valor con manos premium. El call no es una opción viable debido al bajo SPR (Stack-to-Pot Ratio) y la desventaja posicional contra uno de los blinds.',
  },
  stats: {
    raise: 0,
    call: 0.0,
    fold: 96.3,
    allin: 3.7,
  },
  range: {
    "AA":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AKs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AKo": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KK":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KQs": { "allin": 38.5, "raise": 0, "call": 0, "fold": 61.5 },
    "QQ":  { "allin": 100,  "raise": 0, "call": 0, "fold": 0 },
    "JJ":  { "allin": 100,  "raise": 0, "call": 0, "fold": 0 },
    "TT":  { "allin": 62,   "raise": 0, "call": 1.5, "fold": 36.5 }
  },
};
