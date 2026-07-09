import type { PreflopStrategy } from '../types';

export const cash6max100bbMpVs3bet: PreflopStrategy = {
  id: 'cash-6max-100bb-mp-vs-3bet',
  title: 'Cash 6-max 100bb MP vs 3bet',
  meta: {
    format: 'CASH',
    players: 6,
    stackBB: 100,
    position: 'MP',
    action: 'vs-3bet',
    strategicNote: 'La estrategia desde MP contra un 3-bet depende críticamente de la posición del jugador que realiza el 3-bet (por ejemplo, CO vs BTN). Debido a esta complejidad, no es posible mostrar una única tabla general. Cada escenario requiere un rango de defensa, 4-bet por valor y 4-bet de farol diferente. Analiza la posición de tu rival para tomar la mejor decisión.',
  },
  stats: {
    raise: 0,
    call: 0,
    fold: 0,
    allin: 0,
  },
  range: {},
};
