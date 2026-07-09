import type { PreflopStrategy } from '../types';

export const mtt8max100bbMpVs3bet: PreflopStrategy = {
  id: 'mtt-8max-100bb-mp-vs-3bet',
  title: 'MTT 8-max 100bb MP vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 100,
    position: 'MP',
    action: 'vs-3bet',
    strategicNote: 'En una mesa de 8 jugadores de MTT, al abrir desde MP y enfrentar un 3-bet, nuestra estrategia de defensa debe ser cuidadosa. Estamos fuera de posición contra la mayoría de los jugadores. Este rango se polariza: hacemos 4-bet con nuestras manos más fuertes por valor y como semi-farol con manos que tienen buenos bloqueadores. La mayoría de nuestro rango de apertura se retira, ya que pagar fuera de posición puede ser problemático con un stack de 100bb, donde los errores post-flop son costosos.',
  },
  stats: {
    raise: 2.6,
    call: 0.0,
    fold: 97.4,
    allin: 0.0,
  },
  range: {
    "AA": { "allin": 0, "raise": 100, "fold": 0 },
    "AKs": { "allin": 9, "raise": 91, "fold": 0 },
    "AQs": { "allin": 0, "raise": 29.5, "fold": 70.5 },
    "AJs": { "allin": 0, "raise": 7, "fold": 93 },
    "ATs": { "allin": 0, "raise": 32, "fold": 68 },
    "A9s": { "allin": 0, "raise": 5.5, "fold": 94.5 },
    "A8s": { "allin": 0, "raise": 5.5, "fold": 94.5 },
    "A5s": { "allin": 0, "raise": 33, "fold": 67 },
    "AKo": { "allin": 0, "raise": 72, "fold": 28 },
    "KK": { "allin": 1, "raise": 99, "fold": 0 },
    "QQ": { "allin": 0, "raise": 81.5, "fold": 18.5 },
    "JJ": { "allin": 0, "raise": 19.5, "fold": 80.5 },
    "TT": { "allin": 0, "raise": 4, "fold": 96 }
  },
};
