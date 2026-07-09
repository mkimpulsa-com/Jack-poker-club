import type { PreflopStrategy } from '../types';

export const mtt8max20bbHjVs3bet: PreflopStrategy = {
  id: 'mtt-8max-20bb-hj-vs-3bet',
  title: 'MTT 8-max 20bb HJ vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 20,
    position: 'HJ',
    action: 'vs-3bet',
    strategicNote: 'Desde el Hijack con 20bb, al enfrentar un 3-bet, la estrategia es simple y potente: 4-bet all-in o fold. Con un stack corto, no hay espacio para pagar. Se va all-in únicamente con un rango de valor premium para maximizar la equity. Cualquier mano fuera de este rango se retira para preservar el stack y evitar situaciones dominadas.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 96.7,
    allin: 3.3,
  },
  range: {
    "AA": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AKs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AQs": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "AKo": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "KK": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "QQ": { "allin": 100, "raise": 0, "call": 0, "fold": 0 },
    "JJ": { "allin": 100, "raise": 0, "call": 0, "fold": 0 }
  },
};
