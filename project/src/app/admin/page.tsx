'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useFirebase, useMemoFirebase, useCollection, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Shield, Trash2, Settings, LayoutDashboard, Megaphone, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { collection, query, orderBy, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import our new components
import { Dashboard } from './components/dashboard';
import { EventsManagement } from './components/events-management';
import { HomeFeaturesManagement } from './components/home-features-management';

type Post = {
    id: string;
    title: string;
    authorName: string;
    authorPhotoUrl: string;
    createdAt: { seconds: number; nanoseconds: number };
};

type Announcement = {
  id: string;
  content: string;
};

const ADMIN_EMAILS = ['jackskkclub@gmail.com', 'guillepasqui@gmail.com', 'robertemprende000@gmail.com'];

function PostManagement() {
    const { firestore } = useFirebase();
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const postsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'hand-analysis-posts'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: posts, isLoading } = useCollection<Post>(postsQuery);

    const confirmDelete = async () => {
        if (!firestore || !postToDelete) return;
        const postRef = doc(firestore, 'hand-analysis-posts', postToDelete);
        await deleteDoc(postRef);
        setPostToDelete(null);
    };

    if (isLoading) {
        return <p className="text-muted-foreground">Cargando publicaciones...</p>;
    }

    if (!posts || posts.length === 0) {
        return <p className="text-muted-foreground">No hay publicaciones para mostrar.</p>;
    }

    return (
        <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {posts.map((post) => (
                    <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                             <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={post.authorPhotoUrl} alt={post.authorName} />
                                    <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{post.authorName}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            {post.createdAt ? 
                                format(new Date(post.createdAt.seconds * 1000), "d MMM, yyyy", { locale: es })
                                : 'N/A'
                            }
                        </TableCell>
                        <TableCell className="text-right">
                             <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setPostToDelete(post.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                             </AlertDialogTrigger>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la publicación
                de nuestros servidores.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    );
}

function AnnouncementManagement() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [announcementContent, setAnnouncementContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const announcementDocRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'announcements', 'latest');
    }, [firestore]);

    const { data: announcement, isLoading } = useDoc<Announcement>(announcementDocRef);

     useEffect(() => {
        if (announcement) {
            setAnnouncementContent(announcement.content);
        } else if (!isLoading) {
            setAnnouncementContent('');
        }
    }, [announcement, isLoading]);

    const handleSave = async () => {
        if (!firestore || !announcementDocRef) {
            toast({
                variant: "destructive",
                title: "Error de inicialización",
                description: "Los servicios de Firebase no están disponibles.",
            });
            return;
        }

        setIsSaving(true);
        
        try {
            const dataToSave = {
                content: announcementContent,
                updatedAt: serverTimestamp(),
            };

            await setDoc(announcementDocRef, dataToSave, { merge: true });

            toast({
                title: "Anuncio actualizado",
                description: "El anuncio en la página de inicio ha sido actualizado.",
            });

        } catch (error: any) {
            console.error("Error al actualizar el anuncio: ", error);
            
            toast({
                variant: "destructive",
                title: "Error al actualizar",
                description: error.message || "No se pudo guardar el anuncio.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
             <div className="space-y-1">
                <Label htmlFor="announcement-text">Mensaje del Anuncio</Label>
                <Textarea
                    id="announcement-text"
                    placeholder="Escribe tu anuncio aquí..."
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    rows={4}
                    disabled={isLoading || isSaving}
                />
            </div>

            <Button onClick={handleSave} disabled={isLoading || isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Anuncio'}
            </Button>
        </div>
    );
}

export default function AdminPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && (!user || !ADMIN_EMAILS.includes(user.email!))) {
            router.replace('/');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user || !ADMIN_EMAILS.includes(user.email!)) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="container py-12 md:py-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <Shield className="h-16 w-16 mx-auto text-primary mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
                    Panel de Administrador
                </h1>
                <p className="text-lg text-muted-foreground">
                    Bienvenido, {user.displayName}. Aquí puedes gestionar todos los aspectos del club.
                </p>
            </div>

            <div className="max-w-6xl mx-auto">
                <Tabs defaultValue="dashboard" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="dashboard" className="flex gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Panel de Control
                        </TabsTrigger>
                        <TabsTrigger value="posts" className="flex gap-2">
                            <Settings className="h-4 w-4" />
                            Publicaciones
                        </TabsTrigger>
                        <TabsTrigger value="announcements" className="flex gap-2">
                            <Megaphone className="h-4 w-4" />
                            Anuncios
                        </TabsTrigger>
                        <TabsTrigger value="events" className="flex gap-2">
                            <Calendar className="h-4 w-4" />
                            Eventos
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="mt-0">
                        <Dashboard />
                    </TabsContent>

                    <TabsContent value="posts" className="mt-0">
                        <HomeFeaturesManagement />
                    </TabsContent>

                    <TabsContent value="announcements" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestionar Anuncio Principal</CardTitle>
                                <CardDescription>Publica un mensaje importante que aparecerá destacado en la página de inicio para todos los usuarios.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AnnouncementManagement />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="events" className="mt-0">
                        <EventsManagement />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
