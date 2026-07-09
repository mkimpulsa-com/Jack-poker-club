import type { PreflopStrategy } from '../types';

export const mtt8max20bbSbVs3bet: PreflopStrategy = {
  id: 'mtt-8max-20bb-sb-vs-3bet',
  title: 'MTT 8-max 20bb SB vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 20,
    position: 'SB',
    action: 'vs-3bet',
    strategicNote: 'Desde la SB con 20bb, al enfrentar un 3-bet, la estrategia es de 4-bet all-in o fold. Este rango es muy ajustado y se enfoca en manos de valor premium, con algunas jugadas mixtas para equilibrar. Manos fuera de este rango se retiran para evitar situaciones dominadas y preservar el stack.',
  },
  stats: {
    raise: 0.0,
    call: 0.0,
    fold: 95.5,
    allin: 4.5,
  },
  range: {
    "AA":  { "allin": 100.0 },
    "AKs": { "allin": 100.0 },
    "AQs": { "allin": 100.0 },
    "AJs": { "allin": 9.5, "fold": 90.5 },
    "ATs": { "allin": 2.5, "fold": 97.5 },
    "AKo": { "allin": 100.0 },
    "KK":  { "allin": 100.0 },
    "KQs": { "allin": 85.0, "fold": 15.0 },
    "QQ":  { "allin": 100.0 },
    "JJ":  { "allin": 100.0 },
    "TT":  { "allin": 100.0 },
    "99":  { "allin": 23.0, "fold": 77.0 }
  },
};
