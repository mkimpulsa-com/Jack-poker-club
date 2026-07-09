import type { PreflopStrategy } from '../types';

export const mtt8max40bbCoVs3bet: PreflopStrategy = {
  id: 'mtt-8max-40bb-co-vs-3bet',
  title: 'MTT 8-max 40bb CO vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 40,
    position: 'CO',
    action: 'vs-3bet',
    strategicNote: 'Desde el Cutoff con 40bb, al enfrentar un 3-bet, la estrategia es muy polarizada. Se va all-in con un rango de valor premium y algunos bluffs con buenos bloqueadores para equilibrar. El call no es una opción viable, por lo que las manos que no son lo suficientemente fuertes para un 4-bet all-in se retiran.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 96.0,
    allin: 4.0,
  },
  range: {
    "AA":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "AKs": { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "A5s": { "allin": 80, "raise": 0,  "call": 0,  "fold": 20 },
    "AKo": { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "KK":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "QQ":  { "allin": 100, "raise": 0,   "call": 0,  "fold": 0 },
    "JJ":  { "allin": 35, "raise": 0,  "call": 0,  "fold": 65 },
    "66":  { "allin": 30, "raise": 0,  "call": 0,  "fold": 70 }
  },
};
