import type { PreflopStrategy } from '../types';

export const cash6max100bbBtnVs3bet: PreflopStrategy = {
  id: 'cash-6max-100bb-btn-vs-3bet',
  title: 'Cash 6-max 100bb BTN vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 100,
    position: 'BTN',
    action: 'vs-3bet',
    strategicNote: 'Desde el BTN, al enfrentar un 3-bet de las ciegas, nuestro rango de 4-bet se amplía. Seguimos yendo all-in con las manos más premium, pero también añadimos 4-bets de farol con manos que tienen buen potencial de equity y bloqueo, como A5s. El resto de las manos de nuestro rango de apertura se foldean, ya que pagar fuera de posición no suele ser rentable.',
  },
  stats: {
    raise: 3.5,
    call: 0,
    fold: 96.3,
    allin: 0.2,
  },
  range: {
    "AA":  { "allin": 0,  "raise": 100, "call": 0, "fold": 0 },
    "AKs": { "allin": 5,  "raise": 95,  "call": 0, "fold": 0 },
    "AQs": { "allin": 0,  "raise": 100, "call": 0, "fold": 0 },
    "AJs": { "allin": 0,  "raise": 55.5,"call": 0, "fold": 44.5 },
    "A5s": { "allin": 0,  "raise": 39,  "call": 0, "fold": 61 },
    "AKo": { "allin": 0,  "raise": 75,  "call": 0, "fold": 25 },
    "KK":  { "allin": 1,  "raise": 99,  "call": 0, "fold": 0 },
    "KQs": { "allin": 0,  "raise": 56.5,"call": 0, "fold": 43.5 },
    "QQ":  { "allin": 0,  "raise": 100, "call": 0, "fold": 0 },
    "JJ":  { "allin": 0,  "raise": 62,  "call": 0, "fold": 38 },
    "TT":  { "allin": 0,  "raise": 29.5,"call": 0, "fold": 70.5 },
    "99":  { "allin": 0,  "raise": 11,  "call": 0, "fold": 89 }
  },
};
