import type { PreflopStrategy } from '../types';

export const mtt8max100bbSbVs3bet: PreflopStrategy = {
  id: 'mtt-8max-100bb-sb-vs-3bet',
  title: 'MTT 8-max 100bb SB vs 3bet',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 100,
    position: 'SB',
    action: 'vs-3bet',
    strategicNote: 'Desde la SB con 100bb, al enfrentar un 3-bet, la estrategia es muy polarizada y agresiva. No queremos simplemente pagar y jugar un pozo multi-way fuera de posición. Hacemos 4-bet con nuestras manos más fuertes por valor y como semi-farol con manos que tienen buenos bloqueadores (como AKo, A5s). El resto de las manos que no son lo suficientemente fuertes para un 4-bet se retiran para evitar situaciones dominadas y difíciles post-flop.',
  },
  stats: {
    raise: 2.5,
    call: 0.0,
    fold: 97.1,
    allin: 0.4,
  },
  range: {
    "AA": { "allin": 0, "raise": 100, "fold": 0 },
    "AKs": { "allin": 50, "raise": 50, "fold": 0 },
    "AQs": { "allin": 0, "raise": 37, "fold": 63 },
    "AJs": { "allin": 0, "raise": 4.5, "fold": 95.5 },
    "ATs": { "allin": 0, "raise": 20, "fold": 80 },
    "A5s": { "allin": 0, "raise": 7, "fold": 93 },
    "AKo": { "allin": 17.5, "raise": 74.5,"fold": 8 },
    "KK": { "allin": 27.5, "raise": 72.5,"fold": 0 },
    "QQ": { "allin": 0, "raise": 100, "fold": 0 },
    "JJ": { "allin": 0, "raise": 45, "fold": 55 },
    "TT": { "allin": 0, "raise": 2.5, "fold": 97.5 }
  },
};
