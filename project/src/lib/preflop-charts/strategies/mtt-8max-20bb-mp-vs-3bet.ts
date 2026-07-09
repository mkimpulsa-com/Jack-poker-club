import type { PreflopStrategy } from '../types';

export const mtt8max20bbMpVs3bet: PreflopStrategy = {
  id: 'mtt-8max-20bb-mp-vs-3bet',
  title: 'MTT 8-max 20bb MP vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 20,
    position: 'MP',
    action: 'vs-3bet',
    strategicNote: 'Con un stack de 20bb, al enfrentar un 3-bet desde MP, la estrategia se vuelve extremadamente simple y de valor. Se va all-in con un rango muy ajustado de manos premium (QQ+, AK, y a veces JJ). Cualquier otra mano se retira para evitar situaciones dominadas y preservar el stack.',
  },
  stats: {
    raise: 0.0,
    call: 0.0,
    fold: 96.8,
    allin: 3.2,
  },
  range: {
    "AA":  { "raise": 0.0, "allin": 100.0, "call": 0.0, "fold": 0.0 },
    "AKs": { "raise": 0.0, "allin": 100.0, "call": 0.0, "fold": 0.0 },
    "AQs": { "raise": 0.0, "allin": 100.0, "call": 0.0, "fold": 0.0 },
    "AKo": { "raise": 0.0, "allin": 100.0, "call": 0.0, "fold": 0.0 },
    "KK":  { "raise": 0.0, "allin": 100.0, "call": 0.0, "fold": 0.0 },
    "QQ":  { "raise": 0.0, "allin": 100.0, "call": 0.0, "fold": 0.0 },
    "JJ": { "raise": 0.0, "allin": 76.5, "call": 0.0, "fold": 23.5 }
  },
};
