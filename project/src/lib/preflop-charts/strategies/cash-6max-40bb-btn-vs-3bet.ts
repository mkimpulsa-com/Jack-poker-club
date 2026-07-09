import type { PreflopStrategy } from '../types';

export const cash6max40bbBtnVs3bet: PreflopStrategy = {
  id: 'cash-6max-40bb-btn-vs-3bet',
  title: 'Cash 6-max 40bb BTN vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 40,
    position: 'BTN',
    action: 'vs-3bet',
    strategicNote: 'Desde el BTN con un stack de 40bb, al enfrentar un 3-bet, nuestra estrategia es principalmente de 4-bet o fold. Hacemos 4-bet/all-in con un rango polarizado que incluye manos de valor premium y algunos bluffs con buenos bloqueadores. El call es muy raro ya que jugar fuera de posición en un pozo 3-beteado con stacks cortos puede ser muy difícil.',
  },
  stats: {
    raise: 2.43,
    call: 0.02,
    fold: 96.15,
    allin: 1.4,
  },
  range: {
    "AA": {
      "allin": 0,
      "raise": 100,
      "call": 0,
      "fold": 0
    },
    "AKs": {
      "allin": 0,
      "raise": 100,
      "call": 0,
      "fold": 0
    },
    "AQs": {
      "allin": 0,
      "raise": 99,
      "call": 1,
      "fold": 0
    },
    "AKo": {
      "allin": 93.5,
      "raise": 6.5,
      "call": 0,
      "fold": 0
    },
    "KK": {
      "allin": 18,
      "raise": 82,
      "call": 0,
      "fold": 0
    },
    "KQs": {
      "allin": 0,
      "raise": 64.18,
      "call": 1.0,
      "fold": 34.82
    },
    "KJs": {
      "allin": 0,
      "raise": 67.66,
      "call": 1.99,
      "fold": 30.35
    },
    "AQo": {
      "allin": 0,
      "raise": 13.5,
      "call": 0,
      "fold": 86.5
    },
    "QQ": {
      "allin": 100,
      "raise": 0,
      "call": 0,
      "fold": 0
    },
    "JJ": {
      "allin": 4,
      "raise": 94,
      "call": 2,
      "fold": 0
    }
  },
};
