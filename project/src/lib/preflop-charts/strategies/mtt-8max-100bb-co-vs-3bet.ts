import type { PreflopStrategy } from '../types';

export const mtt8max100bbCoVs3bet: PreflopStrategy = {
  id: 'mtt-8max-100bb-co-vs-3bet',
  title: 'MTT 8-max 100bb CO vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 100,
    position: 'CO',
    action: 'vs-3bet',
    strategicNote: 'Desde el Cutoff, al enfrentar un 3-bet, la estrategia es polarizada. Hacemos 4-bet o vamos all-in con nuestras manos más fuertes por valor y con algunos bluffs con buenos bloqueadores para equilibrar. La mayoría de las manos se retiran para evitar jugar un pozo grande fuera de posición.',
  },
  stats: {
    raise: 7.3,
    call: 0.0,
    fold: 92.3,
    allin: 0.4,
  },
  range: {
    "AA":  { "allin": 0,   "raise": 100,  "call": 0, "fold": 0 },
    "AKs": { "allin": 38.5,"raise": 61.5, "call": 0, "fold": 0 },
    "AQs": { "allin": 0,   "raise": 28.5, "call": 0, "fold": 71.5 },
    "AJs": { "allin": 0,   "raise": 4,    "call": 0, "fold": 96 },
    "ATs": { "allin": 0,   "raise": 26.5, "call": 0, "fold": 73.5 },
    "A9s": { "allin": 0,   "raise": 5,    "call": 0, "fold": 95 },
    "A5s": { "allin": 0,   "raise": 26.5, "call": 0, "fold": 73.5 },
    "AKo": { "allin": 0,   "raise": 80.5, "call": 0, "fold": 19.5 },
    "KK":  { "allin": 9,   "raise": 91,   "call": 0, "fold": 0 },
    "QQ":  { "allin": 0,   "raise": 91.5, "call": 0, "fold": 8.5 },
    "JJ":  { "allin": 0,   "raise": 18,   "call": 0, "fold": 82 },
    "TT":  { "allin": 0,   "raise": 11.5, "call": 0, "fold": 88.5 }
  },
};
