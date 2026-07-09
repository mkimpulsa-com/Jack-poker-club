import type { PreflopStrategy } from '../types';

export const mtt8max40bbBbRfi: PreflopStrategy = {
  id: 'mtt-8max-40bb-bb-rfi',
  title: 'MTT 8-max 40bb BB RFI',
  meta: {
    format: 'MTT',
    players: 8,
    stackBB: 40,
    position: 'BB',
    action: 'RFI',
    strategicNote: 'En una situación de Raise First In (RFI), si la acción llega a la Ciega Grande (BB) y todos los jugadores anteriores se han retirado, la mano termina. La BB gana las ciegas automáticamente y no tiene la oportunidad de hacer un "raise first in". Por lo tanto, no existe una tabla de RFI para esta posición.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 0,
    allin: 0,
  },
  range: {},
};
