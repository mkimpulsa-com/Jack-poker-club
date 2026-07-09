import type { PreflopStrategy } from '../types';

export const mtt8max100bbBtnVs3bet: PreflopStrategy = {
  id: 'mtt-8max-100bb-btn-vs-3bet',
  title: 'MTT 8-max 100bb BTN vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 100,
    position: 'BTN',
    action: 'vs-3bet',
    strategicNote: 'Desde el BTN, al enfrentar un 3-bet, nuestra estrategia se vuelve más compleja. Con 100bb, tenemos las odds implícitas para pagar con un rango más amplio de manos especulativas. Este rango muestra una estrategia polarizada: hacemos 4-bet con nuestras manos más fuertes y algunos bluffs con buenos bloqueadores, pagamos con manos que juegan bien post-flop y foldeamos el resto para evitar situaciones complicadas.',
  },
  stats: {
    raise: 2.4,
    call: 1.4,
    fold: 96.2,
    allin: 0.0,
  },
  range: {
    "AA": { "raise": 100, "call": 0, "fold": 0, "allin": 0 },
    "AKs": { "raise": 55, "call": 45, "fold": 0, "allin": 0 },
    "AQs": { "raise": 38, "call": 62, "fold": 0, "allin": 0 },
    "AJs": { "raise": 22.8856, "call": 13.4328, "fold": 63.6816, "allin": 0 },
    "ATs": { "raise": 25, "call": 2.5, "fold": 72.5, "allin": 0 },
    "A5s": { "raise": 25, "call": 0, "fold": 75, "allin": 0 },
    "AKo": { "raise": 63, "call": 20.5, "fold": 16.5, "allin": 0 },
    "KK": { "raise": 74, "call": 26, "fold": 0, "allin": 0 },
    "KQs": { "raise": 8.4577, "call": 12.9353,"fold": 78.607, "allin": 0 },
    "KJs": { "raise": 3, "call": 0, "fold": 97, "allin": 0 },
    "QQ": { "raise": 38, "call": 62, "fold": 0, "allin": 0 },
    "JJ": { "raise": 40.5, "call": 41.5, "fold": 18, "allin": 0 },
    "TT": { "raise": 8, "call": 27.5, "fold": 64.5, "allin": 0 },
    "99": { "raise": 0, "call": 9.5, "fold": 90.5, "allin": 0 },
    "88": { "raise": 0, "call": 5.5, "fold": 94.5, "allin": 0 },
    "77": { "raise": 0, "call": 9, "fold": 91, "allin": 0 },
    "65s": { "raise": 0, "call": 8, "fold": 92, "allin": 0 },
    "54s": { "raise": 0, "call": 3, "fold": 97, "allin": 0 }
  },
};
