import type { PreflopStrategy } from '../types';

export const mtt8max20bbUtg1VsOpen: PreflopStrategy = {
  id: 'mtt-8max-20bb-utg1-vs-open',
  title: 'MTT 8-max 20bb UTG+1 vs UTG Open',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 20,
    position: 'UTG+1',
    action: 'vs-open',
    strategicNote: 'Desde UTG+1 con 20bb, al enfrentar una apertura de UTG, la estrategia es de 3-bet o fold. Con un stack corto, no queremos simplemente pagar y jugar fuera de posición. El rango de 3-bet es polarizado: manos de valor muy fuertes que están felices de ir all-in, y algunos bluffs con buenos bloqueadores para equilibrar.',
  },
  stats: {
    raise: 3.6,
    call: 0.0,
    fold: 92.6,
    allin: 3.8,
  },
  range: {
    "AA":  { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "AKs": { "allin": 26.5, "raise": 73.5, "call": 0, "fold": 0 },
    "AQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AJs": { "allin": 27.5, "raise": 72.5, "call": 0, "fold": 0 },
    "ATs": { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "A9s": { "allin": 0, "raise": 46, "call": 0, "fold": 54 },
    "AKo": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KK":  { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "KQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KJs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KTs": { "allin": 0, "raise": 44, "call": 0, "fold": 56 },
    "AQo": { "allin": 68.5, "raise": 31.5, "call": 0, "fold": 0 },
    "KQo": { "allin": 0, "raise": 36.5, "call": 0, "fold": 63.5 },
    "QQ":  { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "AJo": { "allin": 0, "raise": 33.5, "call": 0, "fold": 66.5 },
    "JJ":  { "allin": 99, "raise": 1, "call": 0, "fold": 0 },
    "TT":  { "allin": 75.5, "raise": 24.5, "call": 0, "fold": 0 },
    "99":  { "allin": 85, "raise": 15, "call": 0, "fold": 0 },
    "88":  { "raise": 50, "fold": 50 }
  },
};
