import type { PreflopStrategy } from '../types';

export const cash6max40bbUtgVsOpen: PreflopStrategy = {
  id: 'cash-6max-40bb-utg-vs-open',
  title: 'Cash 6-max 40bb UTG vs Open',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 40,
    position: 'UTG',
    action: 'vs-open',
    strategicNote: 'En esta situación, el jugador en UTG (Under The Gun) es el primero en hablar preflop. Por lo tanto, no puede enfrentarse a una "apertura" (Open) de otro jugador. La acción correcta para esta posición, si nadie ha hablado antes, es "RFI" (Raise First In). No existe una tabla para "vs Open" desde UTG.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 0,
    allin: 0,
  },
  range: {},
};
