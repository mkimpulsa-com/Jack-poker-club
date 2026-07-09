import type { PreflopStrategy } from '../types';

export const mtt8max20bbBbVs3bet: PreflopStrategy = {
  id: 'mtt-8max-20bb-bb-vs-3bet',
  title: 'MTT 8-max 20bb BB vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 20,
    position: 'BB',
    action: 'vs-3bet',
    strategicNote: 'Desde la BB con un stack de 20bb, al enfrentar un 3-bet, la estrategia es de 4-bet all-in o fold. El rango es ajustado y se enfoca en manos premium que tienen una equity sólida para ir all-in. El call no es una opción viable debido al bajo SPR y la desventaja posicional.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 95.6,
    allin: 4.4,
  },
  range: {
    "AA":  { "allin": 100 },
    "AKs": { "allin": 100 },
    "AQs": { "allin": 100 },
    "AJs": { "allin": 20, "fold": 80 },
    "ATs": { "allin": 31, "fold": 69 },
    "AKo": { "allin": 100 },
    "KK":  { "allin": 100 },
    "KQs": { "allin": 35.5, "fold": 64.5 },
    "AQo": { "allin": 11, "fold": 89 },
    "QQ":  { "allin": 100 },
    "JJ":  { "allin": 100 },
    "TT":  { "allin": 100 },
    "99":  { "allin": 60.5, "fold": 39.5 }
  },
};
