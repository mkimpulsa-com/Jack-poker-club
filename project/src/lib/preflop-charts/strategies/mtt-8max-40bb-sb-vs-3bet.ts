import type { PreflopStrategy } from '../types';

export const mtt8max40bbSbVs3bet: PreflopStrategy = {
  id: 'mtt-8max-40bb-sb-vs-3bet',
  title: 'MTT 8-max 40bb SB vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 40,
    position: 'SB',
    action: 'vs-3bet',
    strategicNote: 'Desde la SB con 40bb, al enfrentar un 3-bet, la estrategia es de 4-bet all-in o fold. Este rango es muy ajustado y se enfoca en manos de valor premium, con algunas jugadas mixtas para equilibrar. Manos fuera de este rango se retiran para evitar situaciones dominadas y preservar el stack.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 96.5,
    allin: 3.5,
  },
  range: {
    "AA":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "AKs": { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "A5s": { "allin": 100, "raise": 0,  "call": 0,  "fold": 0 },
    "AKo": { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "KK":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "QQ":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "JJ":  { "allin": 100, "raise": 0,  "call": 0,  "fold": 0 },
    "66":  { "allin": 45, "raise": 0,  "call": 0,  "fold": 65 }
  },
};
