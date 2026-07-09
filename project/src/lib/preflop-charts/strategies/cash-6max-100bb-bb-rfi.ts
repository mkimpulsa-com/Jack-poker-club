import type { PreflopStrategy } from '../types';

export const cash6max100bbBbRfi: PreflopStrategy = {
  id: 'cash-6max-100bb-bb-rfi',
  title: 'Cash 6-max 100bb BB RFI',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 100,
    position: 'BB',
    action: 'RFI',
    strategicNote: 'En una situación de Raise First In (RFI), si la acción llega a la Ciega Grande (BB) y todos los jugadores anteriores se han retirado, la mano termina. La BB gana las ciegas automáticamente. No existe una tabla de RFI para esta posición.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 0,
    allin: 0,
  },
  range: {},
};
