export type Action = 'raise' | 'call' | 'fold' | 'allin';

export type ActionWithFrequency = {
  action: Action;
  frequency: number; // 0-100
};

export type HandActions = {
  raise?: number;
  call?: number;
  fold?: number;
  allin?: number;
};

export interface PreflopStrategy {
  id: string;
  title: string;
  meta: {
    format: 'CASH' | 'MTT';
    players: number;
    stackBB: number;
    position: string;
    action: string;
    strategicNote: string;
  };
  stats: {
    raise: number;
    call: number;
    fold: number;
    allin: number;
  };
  range: {
    [hand: string]: HandActions;
  };
}
