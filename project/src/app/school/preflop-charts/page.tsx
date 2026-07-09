'use client';

import React, { useState, useCallback, CSSProperties, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { BarChart, Play, Lightbulb } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { STRATEGY_MAP } from '@/lib/preflop-charts/registry';
import type { PreflopStrategy, HandActions, Action, ActionWithFrequency } from '@/lib/preflop-charts/types';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const handMatrix: string[][] = ranks.map((rank1, i) =>
  ranks.map((rank2, j) => {
    if (i === j) return `${rank1}${rank2}`;
    if (i < j) return `${rank1}${rank2}s`;
    return `${rank2}${rank1}o`;
  })
);

const actionColors: Record<Action, string> = {
  raise: '#f87171', // Rojo claro
  call: '#34d399',  // Verde
  fold: '#60a5fa',  // Celeste
  allin: '#b91c1c', // Rojo muy fuerte
};

function getCellActions(handActions: HandActions): ActionWithFrequency[] {
  if (!handActions) return [{ action: 'fold', frequency: 100 }];
  
  const actions: ActionWithFrequency[] = [];
  let totalFreq = 0;

  const validActions: Action[] = ['raise', 'call', 'allin'];
  validActions.forEach(action => {
    if (handActions[action] && handActions[action]! > 0) {
      const freq = handActions[action]!;
      actions.push({ action, frequency: freq });
      totalFreq += freq;
    }
  });

  const foldFreq = 100 - totalFreq;
  if (foldFreq > 0.1) { // Use a small tolerance for floating point issues
    actions.push({ action: 'fold', frequency: foldFreq });
  }

  // Fallback in case of rounding errors, etc.
  if (actions.length === 0) return [{ action: 'fold', frequency: 100 }];
  
  return actions.sort((a,b) => b.frequency - a.frequency);
}


function PokerGrid({ strategy }: { strategy: PreflopStrategy | null }) {
  if (!strategy) return null;

  return (
    <Card className='max-w-4xl mx-auto w-full'>
      <CardContent className="p-1 sm:p-2 md:p-2">
        <div className="grid grid-cols-13 gap-0.5 sm:gap-1">
          {handMatrix.flat().map((hand) => {
            const actions = getCellActions(strategy.range[hand]);
            const background = actions.length === 1
              ? actionColors[actions[0].action]
              : `linear-gradient(to right, ${actions.map((a, i) => 
                  `${actionColors[a.action]} ${i > 0 ? `${actions.slice(0, i).reduce((sum, p) => sum + p.frequency, 0)}%` : '0%'}, ${actionColors[a.action]} ${actions.slice(0, i + 1).reduce((sum, p) => sum + p.frequency, 0)}%`
                ).join(', ')})`;

            const cellStyle: CSSProperties = {
                background: background,
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                borderRadius: '0.375rem',
            };

            return (
              <div key={hand} className="aspect-square text-[10px] sm:text-xs md:text-sm" style={cellStyle}>
                {hand}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function Legend() {
    return (
        <div className="flex justify-center items-center gap-4 flex-wrap mt-4 text-sm">
            {Object.entries(actionColors).map(([action, color]) => (
                <div key={action} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }} />
                    <span className="capitalize">{action}</span>
                </div>
            ))}
        </div>
    );
}

type UserProfile = {
    hasSchoolAccess?: boolean;
}

const ADMIN_EMAILS = ['jackskkclub@gmail.com', 'guillepasqui@gmail.com'];

export default function PreflopChartsPage() {
  const [isClient, setIsClient] = useState(false);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);
    
  const { data: userProfile, isLoading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  const [modalidad, setModalidad] = useState('cash');
  const [players, setPlayers] = useState('6');
  const [stack, setStack] = useState('100');
  const [position, setPosition] = useState('utg');
  const [accion, setAccion] = useState('rfi');
  
  const [currentStrategy, setCurrentStrategy] = useState<PreflopStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCalculate = useCallback(() => {
    setError(null);
    setCurrentStrategy(null);

    const strategyId = `${modalidad}-${players}max-${stack}bb-${position}-${accion}`.toLowerCase();
    
    const strategy = STRATEGY_MAP.get(strategyId);

    if (strategy) {
      setCurrentStrategy(strategy);
    } else {
       setError("No se encontró una estrategia para la combinación de filtros seleccionada.");
    }
  }, [modalidad, players, stack, position, accion]);
  
  React.useEffect(() => {
    if (modalidad === 'mtt') {
        setPlayers('8');
    } else if (modalidad === 'cash') {
      setPlayers('6');
    }
  }, [modalidad]);

  React.useEffect(() => {
    // Reset position if it's not valid for the current number of players
    if (players === '6' && (position === 'utg1' || position === 'hj')) {
      setPosition('utg');
    }
  }, [players, position]);


  if (!isClient || isUserLoading || (user && profileLoading)) {
    return (
        <div className="container py-12 text-center">
            <p>Cargando...</p>
        </div>
    );
  }


  return (
    <div className="container py-8 md:py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <BarChart className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
          Tablas Preflop Interactivas
        </h1>
        <p className="text-lg text-muted-foreground">
          Crea y analiza rangos de póker con nuestra herramienta interactiva. Selecciona tus filtros y visualiza la estrategia óptima.
        </p>
      </div>

      <Card className="mb-8 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Filtros de Estrategia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            
            <div className="grid gap-1.5">
              <Label htmlFor="modalidad">Modalidad</Label>
              <Select value={modalidad} onValueChange={setModalidad}><SelectTrigger id="modalidad"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="mtt">MTT</SelectItem></SelectContent></Select>
            </div>
            
            <div className="grid gap-1.5">
              <Label htmlFor="players">Jugadores</Label>
              <Select value={players} onValueChange={setPlayers}>
                <SelectTrigger id="players"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {modalidad === 'cash' ? (
                    <SelectItem value="6">6 Jugadores</SelectItem>
                  ) : (
                    <SelectItem value="8">8 Jugadores</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="stack">Stack Efectivo (BB)</Label>
                <Select value={stack} onValueChange={setStack}>
                <SelectTrigger id="stack"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="100">100bb</SelectItem>
                    <SelectItem value="40">40bb</SelectItem>
                    <SelectItem value="20">20bb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="posicion">Tu Posición</Label>
              <Select value={position} onValueChange={(value) => setPosition(value)}>
                <SelectTrigger id="posicion"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {players === '8' ? (
                    <>
                      <SelectItem value="utg">UTG</SelectItem>
                      <SelectItem value="utg1">UTG+1</SelectItem>
                      <SelectItem value="mp">MP</SelectItem>
                      <SelectItem value="hj">HJ</SelectItem>
                      <SelectItem value="co">CO</SelectItem>
                      <SelectItem value="btn">BTN</SelectItem>
                      <SelectItem value="sb">SB</SelectItem>
                      <SelectItem value="bb">BB</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="utg">UTG</SelectItem>
                      <SelectItem value="mp">MP</SelectItem>
                      <SelectItem value="co">CO</SelectItem>
                      <SelectItem value="btn">BTN</SelectItem>
                      <SelectItem value="sb">SB</SelectItem>
                      <SelectItem value="bb">BB</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="accion">Acción</Label>
                <Select value={accion} onValueChange={setAccion}>
                <SelectTrigger id="accion"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="rfi">RFI (Sin acción)</SelectItem>
                    <SelectItem value="vs-open">Vs Open</SelectItem>
                    <SelectItem value="vs-3bet">Vs 3bet</SelectItem>
                </SelectContent>
                </Select>
            </div>
            
          </div>
        </CardContent>
        <CardFooter className="flex justify-center md:justify-end">
          <Button size="lg" className="font-bold w-full md:w-auto" onClick={handleCalculate}>
            <Play className="mr-2" />
            Calcular Estrategia
          </Button>
        </CardFooter>
      </Card>
      
      {error && (
         <Alert variant="destructive" className="max-w-xl mx-auto mt-8">
            <BarChart className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {error}
            </AlertDescription>
        </Alert>
      )}

      {currentStrategy && (
        <div className="space-y-8 mt-8">
          {Object.keys(currentStrategy.range).length > 0 ? (
            <>
              <PokerGrid strategy={currentStrategy} />
              <Legend />
              <Alert className="max-w-xl mx-auto">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Nota Estratégica para: {currentStrategy.title}</AlertTitle>
                  <AlertDescription>
                      {currentStrategy.meta.strategicNote}
                  </AlertDescription>
              </Alert>
              <Card className="max-w-xl mx-auto w-full">
                  <CardHeader>
                      <CardTitle>Estadísticas del Rango</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-around">
                      {Object.entries(currentStrategy.stats).map(([action, value]) => (
                          value > 0 && (
                            <div key={action} className="text-center">
                                <p className="text-2xl font-bold" style={{ color: actionColors[action as Action] }}>{value.toFixed(1)}%</p>
                                <p className="text-sm text-muted-foreground capitalize">{action}</p>
                            </div>
                          )
                      ))}
                  </CardContent>
              </Card>
            </>
          ) : (
            <Alert className="max-w-xl mx-auto text-center p-6 border-primary/20 bg-card/50">
                <Lightbulb className="h-6 w-6 mx-auto mb-4 text-primary" />
                <AlertTitle className="text-lg font-bold mb-2">{currentStrategy.title}</AlertTitle>
                <AlertDescription className="text-base">
                    {currentStrategy.meta.strategicNote}
                </AlertDescription>
            </Alert>
          )}
        </div>
      )}

    </div>
  );
}
