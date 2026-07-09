import type { PreflopStrategy } from '../types';

export const cash6max100bbCoVs3bet: PreflopStrategy = {
  id: 'cash-6max-100bb-co-vs-3bet',
  title: 'Cash 6-max 100bb CO vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 100,
    position: 'CO',
    action: 'vs-3bet',
    strategicNote: 'Al enfrentar un 3-bet desde CO, el rango se vuelve muy selectivo. La estrategia se centra en ir all-in por valor con las manos más fuertes (4-bet all-in) y algunos faroles con buen potencial de equity, como A5s, para equilibrar. El resto de las manos se foldean para evitar situaciones complejas postflop con un SPR (Stack-to-Pot Ratio) bajo.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 96.5,
    allin: 3.5,
  },
  range: {
    "AA":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KK":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "QQ":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AKs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AJs": { "allin": 35,  "raise": 0, "call": 0, "fold": 65 },
    "A5s": { "allin": 49.5,"raise": 0, "call": 0, "fold": 50.5 },
    "AKo": { "allin": 73,  "raise": 0, "call": 0, "fold": 27 },
    "KQs": { "allin": 51.5,"raise": 0, "call": 0, "fold": 48.5 },
    "JJ":  { "allin": 57.5,"raise": 0, "call": 0, "fold": 42.5 },
    "TT":  { "allin": 27.5,"raise": 0, "call": 0, "fold": 72.5 },
    "99":  { "allin": 12,  "raise": 0, "call": 0, "fold": 88 },
    "88":  { "allin": 4.5, "raise": 0, "call": 0, "fold": 95.5 }
  },
};
