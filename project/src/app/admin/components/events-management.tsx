'use client';

import React, { useState } from 'react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type EventType = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  createdAt: { seconds: number; nanoseconds: number };
};

export function EventsManagement() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  
  // State for new event form
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('eventDate', 'asc'));
  }, [firestore]);

  const { data: events, isLoading } = useCollection<EventType>(eventsQuery);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    
    setIsCreating(true);
    try {
      await addDoc(collection(firestore, 'events'), {
        title,
        description,
        eventDate,
        location,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Evento creado",
        description: "El nuevo evento ha sido programado con éxito.",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setEventDate('');
      setLocation('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al crear el evento.",
      });
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!firestore || !eventToDelete) return;
    const eventRef = doc(firestore, 'events', eventToDelete);
    await deleteDoc(eventRef);
    setEventToDelete(null);
    toast({
      title: "Evento eliminado",
      description: "El evento fue borrado exitosamente.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Evento</CardTitle>
          <CardDescription>Añade un nuevo torneo o evento para el club.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del evento</Label>
                <Input 
                  id="title" 
                  placeholder="Ej: Torneo Freeroll Semanal" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Fecha y Hora</Label>
                <Input 
                  id="date" 
                  type="datetime-local" 
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Ubicación / Plataforma</Label>
                <Input 
                  id="location" 
                  placeholder="Ej: Online (Jack Poker App) o Dirección Física" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detalles sobre el buy-in, premios, etc." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <Button type="submit" disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" />
              {isCreating ? 'Guardando...' : 'Añadir Evento'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Fecha Programada</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Cargando eventos...</TableCell>
                    </TableRow>
                  ) : (!events || events.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No hay eventos programados.</TableCell>
                    </TableRow>
                  ) : (
                    events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            {event.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          {event.eventDate ? 
                            format(new Date(event.eventDate), "d MMM, yyyy - HH:mm", { locale: es })
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEventToDelete(event.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente el evento seleccionado de la base de datos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
