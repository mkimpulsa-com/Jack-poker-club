import type { PreflopStrategy } from '../types';

export const mtt8max40bbBbVs3bet: PreflopStrategy = {
  id: 'mtt-8max-40bb-bb-vs-3bet',
  title: 'MTT 8-max 40bb BB vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 40,
    position: 'BB',
    action: 'vs-3bet',
    strategicNote: 'Desde la BB con 40bb, al enfrentar un 3-bet, la estrategia es muy polarizada. Se va all-in con manos premium por valor y se pagan algunas manos para set-mining. La mayoría de las manos se retiran debido a la desventaja posicional y al riesgo de dominación.',
  },
  stats: {
    raise: 0.0,
    call: 0.1,
    fold: 96.4,
    allin: 3.5,
  },
  range: {
    "AA":  { "allin": 97.5, "raise": 0,   "call": 2.5,  "fold": 0 },
    "AKs": { "allin": 100,  "raise": 0,   "call": 0,    "fold": 0 },
    "AQs": { "allin": 54.5, "raise": 0,   "call": 9.0,  "fold": 36.5 },
    "A5s": { "allin": 71.5, "raise": 0,   "call": 0,    "fold": 28.5 },
    "AKo": { "allin": 100,  "raise": 0,   "call": 0,    "fold": 0 },
    "KK":  { "allin": 100,  "raise": 0,   "call": 0,    "fold": 0 },
    "KQs": { "allin": 0,    "raise": 0,   "call": 0,    "fold": 100 },
    "QQ":  { "allin": 99.5, "raise": 0,   "call": 0.5,  "fold": 0 },
    "JJ":  { "allin": 96.5, "raise": 0,   "call": 3.5,  "fold": 0 },
    "TT":  { "allin": 0,    "raise": 0,   "call": 2.5,  "fold": 97.5 },
    "66":  { "allin": 36.0, "raise": 0,   "call": 0,    "fold": 64.0 }
  },
};
