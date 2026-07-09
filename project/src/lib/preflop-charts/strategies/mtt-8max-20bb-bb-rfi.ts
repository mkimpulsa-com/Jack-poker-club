import type { PreflopStrategy } from '../types';

export const mtt8max20bbBbRfi: PreflopStrategy = {
  id: 'mtt-8max-20bb-bb-rfi',
  title: 'MTT 8-max 20bb BB RFI',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 20,
    position: 'BB',
    action: 'RFI',
    strategicNote: '¡Felicitaciones, has ganado las ciegas! En una situación de "Raise First In" (RFI), si todos los jugadores se retiran hasta tu posición en la Ciega Grande (BB), la mano termina y ganas el pozo automáticamente. Por esta razón, no existe una tabla de estrategia para esta situación específica.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 0,
    allin: 0,
  },
  range: {},
};
