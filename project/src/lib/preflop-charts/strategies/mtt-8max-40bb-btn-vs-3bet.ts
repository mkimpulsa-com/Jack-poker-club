import type { PreflopStrategy } from '../types';

export const mtt8max40bbBtnVs3bet: PreflopStrategy = {
  id: 'mtt-8max-40bb-btn-vs-3bet',
  title: 'MTT 8-max 40bb BTN vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 40,
    position: 'BTN',
    action: 'vs-3bet',
    strategicNote: 'Desde el Botón con 40bb, al enfrentar un 3-bet, la estrategia es muy polarizada: 4-bet all-in o fold. Este rango se compone de manos de valor premium y algunos bluffs para equilibrar. Manos fuera de este rango se retiran para evitar situaciones complejas y preservar el stack.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 96.9,
    allin: 3.1,
  },
  range: {
    "AA":  { "allin": 100 },
    "AKs": { "allin": 100 },
    "A5s": { "allin": 80, "fold": 20 },
    "AKo": { "allin": 100 },
    "KK":  { "allin": 100 },
    "QQ":  { "allin": 100 },
    "JJ":  { "allin": 35, "fold": 65 },
    "66":  { "allin": 30, "fold": 70 }
  },
};
