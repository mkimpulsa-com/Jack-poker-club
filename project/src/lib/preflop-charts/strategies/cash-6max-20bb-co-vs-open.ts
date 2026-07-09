import type { PreflopStrategy } from '../types';

export const cash6max20bbCoVsOpen: PreflopStrategy = {
  id: 'cash-6max-20bb-co-vs-open',
  title: 'Cash 6-max 20bb CO vs Open',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 20,
    position: 'CO',
    action: 'vs-open',
    strategicNote: 'Desde CO con un stack de 20bb, la estrategia contra una apertura es una mezcla de agresión y defensa. Se hacen 3-bets por valor, se paga con manos especulativas para jugar post-flop con posición, y se foldean las manos fácilmente dominadas.',
  },
  stats: {
    raise: 6.1,
    call: 0.3,
    fold: 91.4,
    allin: 2.2,
  },
  range: {
    "AA":  { "raise": 94.5, "allin": 0.0,  "call": 5.5,  "fold": 0.0 },
    "AKs": { "raise": 100.0,"allin": 0.0,  "call": 0.0,  "fold": 0.0 },
    "AQs": { "raise": 100.0,"allin": 0.0,  "call": 0.0,  "fold": 0.0 },
    "AJs": { "raise": 74.5, "allin": 0.0,  "call": 25.5, "fold": 0.0 },
    "ATs": { "raise": 89.0, "allin": 0.0,  "call": 11.0, "fold": 0.0 },
    "A9s": { "raise": 62.5, "allin": 0.0,  "call": 3.5,  "fold": 34.0 },
    "A8s": { "raise": 63.0, "allin": 0.0,  "call": 0.0,  "fold": 37.0 },
    "AKo": { "raise": 39.5, "allin": 60.5, "call": 0.0,  "fold": 0.0 },
    "KK":  { "raise": 100.0,"allin": 0.0,  "call": 0.0,  "fold": 0.0 },
    "KQs": { "raise": 0.0,  "allin": 83.5, "call": 16.5, "fold": 0.0 },
    "KJs": { "raise": 0.0,  "allin": 97.0, "call": 3.0,  "fold": 0.0 },
    "KTs": { "raise": 18.0, "allin": 0.0,  "call": 7.5,  "fold": 74.5 },
    "AQo": { "raise": 37.5, "allin": 60.0, "call": 2.5,  "fold": 0.0 },
    "KQo": { "raise": 100.0,"allin": 0.0,  "call": 0.0,  "fold": 0.0 },
    "QQ":  { "raise": 100.0,"allin": 0.0,  "call": 0.0,  "fold": 0.0 },
    "JJ":  { "raise": 100.0,"allin": 0.0,  "call": 0.0,  "fold": 0.0 },
    "AJo": { "raise": 49.0, "allin": 0.0,  "call": 0.0,  "fold": 51.0 },
    "ATo": { "raise": 15.5, "allin": 0.0,  "call": 0.0,  "fold": 84.5 },
    "TT":  { "raise": 51.5, "allin": 48.5, "call": 0.0,  "fold": 0.0 },
    "99":  { "raise": 10.5, "allin": 86.0, "call": 3.5,  "fold": 0.0 },
    "88":  { "raise": 67.5, "allin": 0.0,  "call": 9.5,  "fold": 23.0 }
  }
};
