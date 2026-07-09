import type { PreflopStrategy } from '../types';

export const mtt8max20bbHjVsOpen: PreflopStrategy = {
  id: 'mtt-8max-20bb-hj-vs-open',
  title: 'MTT 8-max 20bb HJ vs Open',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 20,
    position: 'HJ',
    action: 'vs-open',
    strategicNote: 'Desde Hijack con 20bb, al enfrentar una apertura de una posición anterior (UTG o UTG+1), la estrategia es de 3-bet o fold. Se hace all-in por valor con un rango muy fuerte y se hacen 3-bets más pequeños (o all-in) como farol con manos que tienen buenos bloqueadores (Ases). La mayoría de las manos se retiran para evitar situaciones dominadas.',
  },
  stats: {
    raise: 3.6,
    call: 0.0,
    fold: 91.6,
    allin: 4.8,
  },
  range: {
    "AA":  { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "AKs": { "allin": 44.5, "raise": 55.5, "call": 0, "fold": 0 },
    "AQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AJs": { "allin": 55, "raise": 45, "call": 0, "fold": 0 },
    "ATs": { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "A9s": { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "AKo": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KK":  { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "KQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KJs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KTs": { "allin": 49.7992, "raise": 36.1446, "call": 0, "fold": 14.0562 },
    "AQo": { "allin": 84, "raise": 16, "call": 0, "fold": 0 },
    "KQo": { "allin": 0, "raise": 31.5, "call": 0, "fold": 68.5 },
    "QQ":  { "allin": 13.5, "raise": 86.5, "call": 0, "fold": 0 },
    "QJs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AJo": { "allin": 0, "raise": 43, "call": 0, "fold": 57 },
    "JJ":  { "allin": 74, "raise": 26, "call": 0, "fold": 0 },
    "TT":  { "allin": 96.5, "raise": 3.5, "call": 0, "fold": 0 },
    "99":  { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "88":  { "allin": 43, "raise": 57, "call": 0, "fold": 0 },
    "77":  { "allin": 0, "raise": 25, "call": 0, "fold": 75 }
  },
};
