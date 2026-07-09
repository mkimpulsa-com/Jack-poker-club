import type { PreflopStrategy } from '../types';

export const mtt8max100bbUtgVs3bet: PreflopStrategy = {
  id: 'mtt-8max-100bb-utg-vs-3bet',
  title: 'MTT 8-max 100bb UTG vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 100,
    position: 'UTG',
    action: 'vs-3bet',
    strategicNote: 'Desde UTG en una mesa de 8-max de MTT, al enfrentar un 3-bet, nuestra estrategia debe ser robusta. Estando fuera de posición, el rango se polariza. Hacemos 4-bet con un mix de manos de valor puro y algunos bluffs con buenos bloqueadores. El call se reserva para manos que juegan bien post-flop y tienen la equity para defender. Las manos más débiles del rango de apertura se foldean para evitar situaciones complejas y dominadas con un stack profundo.',
  },
  stats: {
    raise: 2.8,
    call: 5.5,
    fold: 2.1,
    allin: 0.5,
  },
  range: { 
    "AA": { "allin": 0, "raise": 100, "call": 0, "fold": 0 },
    "AKs": { "allin": 50.5, "raise": 49.5, "call": 0, "fold": 0 },
    "AQs": { "allin": 0, "raise": 42, "call": 58, "fold": 0 },
    "AJs": { "allin": 0, "raise": 51.5, "call": 48.5, "fold": 0 },
    "ATs": { "allin": 0, "raise": 26.5, "call": 73.5, "fold": 0 },
    "A9s": { "allin": 0, "raise": 0, "call": 29.5, "fold": 70.5 },
    "A8s": { "allin": 0, "raise": 0, "call": 20, "fold": 80 },
    "A5s": { "allin": 0, "raise": 28.5, "call": 71.5, "fold": 0 },
    "A4s": { "allin": 0, "raise": 17.5, "call": 59.5, "fold": 23 },
    "AKo": { "allin": 42.5, "raise": 17.5, "call": 40, "fold": 0 },
    "KK": { "raise": 100, "call": 0, "fold": 0 },
    "KQs": { "allin": 0, "raise": 17.5, "call": 82.5, "fold": 0 },
    "KJs": { "allin": 0, "raise": 8.5, "call": 91.5, "fold": 0 },
    "KTs": { "allin": 0, "raise": 13, "call": 83.5, "fold": 3.5 },
    "AQo": { "allin": 0, "raise": 4.5, "call": 20.5, "fold": 75 },
    "QQ": { "allin": 0.995025,"raise": 26.865675,"call": 72.1393, "fold": 0 },
    "QJs": { "allin": 0, "raise": 0, "call": 58.5, "fold": 41.5 },
    "QTs": { "allin": 0, "raise": 0, "call": 19, "fold": 81 },
    "JJ": { "allin": 0, "raise": 34.5, "call": 65.5, "fold": 0 },
    "JTs": { "allin": 0, "raise": 14, "call": 86, "fold": 0 },
    "T9s": { "allin": 0, "raise": 6.5, "call": 54, "fold": 39.5 },
    "99": { "allin": 0, "raise": 13.5, "call": 86.5, "fold": 0 },
    "98s": { "allin": 0, "raise": 0, "call": 90.5556, "fold": 9.4444 },
    "88": { "allin": 0, "raise": 5.5, "call": 92.5, "fold": 2 },
    "77": { "allin": 0, "raise": 0, "call": 88, "fold": 12 },
    "66": { "allin": 0, "raise": 0, "call": 74, "fold": 26 },
    "55": { "allin": 0, "raise": 0, "call": 57.5, "fold": 42.5 }
  }
};
