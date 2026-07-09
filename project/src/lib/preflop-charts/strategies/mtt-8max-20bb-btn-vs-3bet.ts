import type { PreflopStrategy } from '../types';

export const mtt8max20bbBtnVs3bet: PreflopStrategy = {
  id: 'mtt-8max-20bb-btn-vs-3bet',
  title: 'MTT 8-max 20bb BTN vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 20,
    position: 'BTN',
    action: 'vs-3bet',
    strategicNote: 'Desde el BTN con un stack de 20bb, al enfrentar un 3-bet, la estrategia es 4-bet all-in o fold. Este rango es muy ajustado y se enfoca en manos de valor premium. El call no es una opción viable debido al bajo SPR (Stack-to-Pot Ratio) y la desventaja posicional contra uno de los blinds.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 94.7,
    allin: 5.3,
  },
  range: {
    "AA":  { "allin": 100 },
    "AKs": { "allin": 100 },
    "AQs": { "allin": 100 },
    "AKo": { "allin": 100 },
    "KK":  { "allin": 100 },
    "QQ":  { "allin": 100 },
    "JJ":  { "allin": 100 },
    "TT":  { "allin": 100 },
    "KQs": { "allin": 85, "fold": 15 },
    "ATs": { "allin": 2.5, "fold": 97.5 }
  },
};
