import type { PreflopStrategy } from '../types';

export const cash6max20bbMpVsOpen: PreflopStrategy = {
  id: 'cash-6max-20bb-mp-vs-open',
  title: 'Cash 6-max 20bb MP vs Open 2.5x',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 20,
    position: 'MP',
    action: 'vs-open',
    strategicNote: "Con 20bb desde MP contra una apertura, la estrategia es principalmente de 3-bet all-in o fold. Se hace 3-bet all-in por valor con un rango fuerte de manos premium y se añaden algunos bluffs con buenos bloqueadores. El call es muy raro debido al bajo SPR (Stack-to-Pot Ratio), que hace que sea difícil jugar post-flop. La mayoría de las manos se foldean para evitar situaciones dominadas.",
  },
  stats: {
    raise: 4.8,
    call: 0.8,
    fold: 91.1,
    allin: 3.3,
  },
  range: {
    "AA": { "allin": 0, "raise": 96, "call": 4, "fold": 0 },
    "AKs": { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "AQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AJs": { "allin": 0, "raise": 79.5, "call": 20.5, "fold": 0 },
    "ATs": { "allin": 0, "raise": 94, "call": 6, "fold": 0 },
    "A9s": { "allin": 0, "raise": 64.6766, "call": 1.4926, "fold": 33.8308 },
    "AKo": { "allin": 57.5, "raise": 42.5, "call": 0, "fold": 0 },
    "KK": { "allin": 0, "raise": 98.5, "call": 1.5, "fold": 0 },
    "KQs": { "allin": 87.5, "raise": 0, "call": 12.5, "fold": 0 },
    "KJs": { "allin": 18.593, "raise": 0, "call": 4.0201, "fold": 77.3869 },
    "KTs": { "allin": 0, "raise": 50, "call": 5.5, "fold": 44.5 },
    "AQo": { "allin": 21.5, "raise": 75, "call": 3.5, "fold": 0 },
    "KQo": { "allin": 0, "raise": 84.5, "call": 0, "fold": 15.5 },
    "QQ": { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "QTs": { "allin": 0, "raise": 0, "call": 2, "fold": 98 },
    "AJo": { "allin": 0, "raise": 42.5, "call": 0, "fold": 57.5 },
    "JJ": { "allin": 0, "raise": 99, "call": 1, "fold": 0 },
    "TT": { "allin": 68, "raise": 31.5, "call": 0.5, "fold": 0 },
    "99": { "allin": 39.196, "raise": 56.7839, "call": 4.0201, "fold": 0 },
    "88": { "allin": 0, "raise": 10.4478, "call": 4.9751, "fold": 84.5771 }
  },
};
