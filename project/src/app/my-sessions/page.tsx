'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useUser, useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BarChart3, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BudgetCard } from '@/components/ui/analytics-bento';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval, type Interval } from 'date-fns';
import { es } from 'date-fns/locale';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


type Session = {
    id: string;
    date: { seconds: number; nanoseconds: number };
    buyIn: number;
    cashOut: number;
    profit: number;
    durationInMinutes: number;
    location: string;
};

const sessionSchema = z.object({
  buyIn: z.coerce.number().positive({ message: "El buy-in debe ser un número positivo." }),
  cashOut: z.coerce.number().min(0, { message: "El cash-out no puede ser negativo." }),
  durationInMinutes: z.coerce.number().positive({ message: "La duración debe ser un número positivo." }),
  location: z.string().min(1, { message: "La ubicación es obligatoria." }),
});

type SessionFormValues = z.infer<typeof sessionSchema>;

function AddSessionDialog({ onSessionAdded, onLocalSessionAdded }: { onSessionAdded: () => void; onLocalSessionAdded?: (session: Session) => void }) {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
  });

  const onSubmit: SubmitHandler<SessionFormValues> = async (data) => {
    const profit = data.cashOut - data.buyIn;

    if (user && firestore) {
      try {
        const sessionData = {
          ...data,
          profit,
          userId: user.uid,
          date: serverTimestamp(),
        };
        const sessionsCollection = collection(firestore, 'users', user.uid, 'sessions');
        await addDoc(sessionsCollection, sessionData);
        
        toast({ title: 'Éxito', description: 'Tu sesión ha sido registrada.' });
        reset();
        onSessionAdded();
        setIsOpen(false);
      } catch (error) {
        console.error("Error adding session:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo registrar la sesión.' });
      }
    } else {
      const newSession: Session = {
        id: Math.random().toString(36).substring(2, 9),
        date: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        buyIn: data.buyIn,
        cashOut: data.cashOut,
        profit,
        durationInMinutes: data.durationInMinutes,
        location: data.location,
      };
      if (onLocalSessionAdded) {
        onLocalSessionAdded(newSession);
      }
      toast({ title: 'Éxito', description: 'Tu sesión ha sido registrada localmente.' });
      reset();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Registrar Sesión
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nueva Sesión de Poker</DialogTitle>
          <DialogDescription>
            Añade los detalles de tu última sesión para llevar un seguimiento de tu progreso.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="buyIn">Buy-in ($)</Label>
                <Input id="buyIn" type="number" {...register('buyIn')} />
                {errors.buyIn && <p className="text-sm text-destructive">{errors.buyIn.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="cashOut">Cash-out ($)</Label>
                <Input id="cashOut" type="number" {...register('cashOut')} />
                {errors.cashOut && <p className="text-sm text-destructive">{errors.cashOut.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="durationInMinutes">Duración (minutos)</Label>
                <Input id="durationInMinutes" type="number" {...register('durationInMinutes')} />
                {errors.durationInMinutes && <p className="text-sm text-destructive">{errors.durationInMinutes.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input id="location" placeholder="Ej: Online, Casino Central" {...register('location')} />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
            </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Sesión'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SessionsTable({ sessions, onDelete }: { sessions: Session[], onDelete: (sessionId: string) => void }) {
    if (sessions.length === 0) {
        return <p className="text-muted-foreground text-center mt-8">Aún no has registrado ninguna sesión.</p>;
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Historial de Sesiones</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Duración</TableHead>
                            <TableHead className="text-right">Profit</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sessions.map(session => (
                            <TableRow key={session.id}>
                                <TableCell>{session.date ? format(new Date(session.date.seconds * 1000), "d MMM, yyyy", { locale: es }) : 'Pendiente...'}</TableCell>
                                <TableCell>{session.location}</TableCell>
                                <TableCell>{session.durationInMinutes} min</TableCell>
                                <TableCell className={`text-right font-medium ${session.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    ${session.profit.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(session.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function MySessionsPage() {
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);
    const [filter, setFilter] = useState('month');
    const [localSessions, setLocalSessions] = useState<Session[]>([]);
    const [localLoading, setLocalLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('guest_sessions');
            if (stored) {
                try {
                    setLocalSessions(JSON.parse(stored));
                } catch (e) {
                    console.error("Error parsing guest_sessions:", e);
                }
            }
            setLocalLoading(false);
        }
    }, [user]);

    const sessionsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'users', user.uid, 'sessions'), orderBy('date', 'desc'));
    }, [firestore, user]);

    const { data: sessionsFromFirestore, isLoading: isFirestoreLoading } = useCollection<Session>(sessionsQuery);

    const sessions = user ? (sessionsFromFirestore || []) : localSessions;
    const isLoading = user ? isFirestoreLoading : localLoading;

    const chartData = useMemo(() => {
        if (!sessions) return { periodData: [], periodProfit: 0, totalProfit: 0 };

        const now = new Date();
        let interval: Interval;

        switch (filter) {
            case 'week':
                interval = { start: startOfWeek(now, { locale: es }), end: endOfWeek(now, { locale: es }) };
                break;
            case 'year':
                interval = { start: startOfYear(now), end: endOfYear(now) };
                break;
            case 'month':
            default:
                interval = { start: startOfMonth(now), end: endOfMonth(now) };
                break;
        }

        const filteredSessions = sessions.filter(s => s.date && isWithinInterval(new Date(s.date.seconds * 1000), interval));
        const periodProfit = filteredSessions.reduce((acc, s) => acc + s.profit, 0);
        const totalProfit = sessions.reduce((acc, s) => acc + s.profit, 0);
        
        let periodData: { label: string; value: number }[] = [];

        if (filter === 'week') {
            const days = eachDayOfInterval(interval);
            periodData = days.map(day => {
                const daySessions = filteredSessions.filter(s => format(new Date(s.date.seconds * 1000), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
                const profit = daySessions.reduce((acc, s) => acc + s.profit, 0);
                return { label: format(day, 'E', { locale: es }), value: profit };
            });
        } else if (filter === 'month') {
            const weeks = eachWeekOfInterval(interval, { weekStartsOn: 1 });
            periodData = weeks.map((weekStart, index) => {
                const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
                const weekSessions = filteredSessions.filter(s => isWithinInterval(new Date(s.date.seconds * 1000), { start: weekStart, end: weekEnd }));
                const profit = weekSessions.reduce((acc, s) => acc + s.profit, 0);
                return { label: `Sem ${index + 1}`, value: profit };
            });
        } else if (filter === 'year') {
            const months = eachMonthOfInterval(interval);
            periodData = months.map(monthStart => {
                const monthSessions = filteredSessions.filter(s => format(new Date(s.date.seconds * 1000), 'yyyy-MM') === format(monthStart, 'yyyy-MM'));
                const profit = monthSessions.reduce((acc, s) => acc + s.profit, 0);
                return { label: format(monthStart, 'MMM', { locale: es }), value: profit };
            });
        }
        
        return { periodData, periodProfit, totalProfit };

    }, [sessions, filter]);

    const handleDelete = async (sessionId: string) => {
        if (user && firestore) {
            const sessionRef = doc(firestore, 'users', user.uid, 'sessions', sessionId);
            try {
                await deleteDoc(sessionRef);
                toast({ title: 'Sesión eliminada' });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar la sesión.' });
            }
        } else {
            const updated = localSessions.filter(s => s.id !== sessionId);
            setLocalSessions(updated);
            localStorage.setItem('guest_sessions', JSON.stringify(updated));
            toast({ title: 'Sesión eliminada localmente' });
        }
    };

    const handleLocalSessionAdded = (newSession: Session) => {
        const updated = [newSession, ...localSessions];
        setLocalSessions(updated);
        localStorage.setItem('guest_sessions', JSON.stringify(updated));
    };

    if (!isClient || isUserLoading) {
        return <div className="container py-12 text-center">Cargando...</div>;
    }

  return (
    <div className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div className="text-center md:text-left mb-6 md:mb-0">
                <BarChart3 className="h-16 w-16 mx-auto md:mx-0 text-primary mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
                    Mis Sesiones
                </h1>
                <p className="text-lg text-muted-foreground">
                    Registra tu juego, analiza tus resultados y mejora tu rendimiento.
                </p>
            </div>
            <AddSessionDialog onSessionAdded={() => {}} onLocalSessionAdded={handleLocalSessionAdded} />
        </div>

        <div className="grid gap-12">
            <div className="flex flex-col items-center gap-6">
                <BudgetCard 
                    data={chartData.periodData}
                    totalProfit={chartData.totalProfit}
                    periodProfit={chartData.periodProfit}
                />
                 <ToggleGroup 
                    type="single" 
                    defaultValue={filter}
                    onValueChange={(value) => {if (value) setFilter(value)}}
                    className="bg-card/50 p-1 rounded-full border"
                 >
                    <ToggleGroupItem value="week" className="rounded-full">Semana</ToggleGroupItem>
                    <ToggleGroupItem value="month" className="rounded-full">Mes</ToggleGroupItem>
                    <ToggleGroupItem value="year" className="rounded-full">Año</ToggleGroupItem>
                </ToggleGroup>
            </div>

            {isLoading && <p className="text-center">Cargando sesiones...</p>}
            {!isLoading && sessions && <SessionsTable sessions={sessions} onDelete={handleDelete} />}
        </div>
    </div>
  );
}
