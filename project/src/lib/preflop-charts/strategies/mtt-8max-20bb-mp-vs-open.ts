import type { PreflopStrategy } from '../types';

export const mtt8max20bbMpVsOpen: PreflopStrategy = {
  id: 'mtt-8max-20bb-mp-vs-open',
  title: 'MTT 8-max 20bb MP vs Open',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 20,
    position: 'MP',
    action: 'vs-open',
    strategicNote: 'Desde la Posición Media (MP) con 20bb, al enfrentar una apertura de una posición anterior, la estrategia es casi exclusivamente de 3-bet o fold. Con un stack corto, pagar fuera de posición es raramente una buena opción. Este rango muestra una estrategia agresiva, yendo all-in o haciendo un 3-bet más pequeño con un mix de manos de valor y bluffs para maximizar la fold equity.',
  },
  stats: {
    raise: 4.8,
    call: 0,
    fold: 91.4,
    allin: 3.8,
  },
  range: {
    "AA":  { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "AKs": { "allin": 38.5, "raise": 61.5, "call": 0, "fold": 0 },
    "AQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AJs": { "allin": 23.5, "raise": 76.5, "call": 0, "fold": 0 },
    "ATs": { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "A9s": { "allin": 0, "raise": 66, "call": 0, "fold": 34 },
    "AKo": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KK":  { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "KQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KJs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KTs": { "allin": 0, "raise": 23, "call": 0, "fold": 77 },
    "AQo": { "allin": 81.5, "raise": 18.5, "call": 0, "fold": 0 },
    "KQo": { "allin": 0, "raise": 39, "call": 0, "fold": 61 },
    "QQ":  { "allin": 9.5, "raise": 90.5, "call": 0, "fold": 0 },
    "QJs": { "allin": 78.5, "raise": 0, "call": 0, "fold": 21.5 },
    "AJo": { "allin": 0, "raise": 31.5, "call": 0, "fold": 68.5 },
    "JJ":  { "allin": 94.5, "raise": 5.5, "call": 0, "fold": 0 },
    "TT":  { "allin": 83, "raise": 17, "call": 0, "fold": 0 },
    "99":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "88":  { "allin": 36, "raise": 64, "call": 0, "fold": 0 },
    "77":  { "allin": 0, "raise": 2.5, "call": 0, "fold": 97.5 }
  },
};
