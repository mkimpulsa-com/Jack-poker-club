import type { PreflopStrategy } from '../types';

export const mtt8max40bbMpVs3bet: PreflopStrategy = {
  id: 'mtt-8max-40bb-mp-vs-3bet',
  title: 'MTT 8-max 40bb MP vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 40,
    position: 'MP',
    action: 'vs-3bet',
    strategicNote: 'Con 40bb desde MP, al enfrentar un 3-bet, la estrategia es muy polarizada: 4-bet all-in o fold. Se va all-in con un rango de valor premium y algunos bluffs con buenos bloqueadores. El call no es una opción viable debido al SPR y la desventaja posicional.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 97.2,
    allin: 2.8,
  },
  range: {
    "AA":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "AKs": { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "A5s": { "allin": 70.5, "raise": 0,  "call": 0,  "fold": 29.5 },
    "AKo": { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "KK":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "QQ":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "JJ":  { "allin": 15.5, "raise": 0,  "call": 0,  "fold": 84.5 }
  },
};
