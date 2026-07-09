'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useCollection, useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Shield, Trash2, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { collection, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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
import { setDoc, serverTimestamp } from 'firebase/firestore';
import { Switch } from '@/components/ui/switch';


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

type UserProfile = {
    id: string;
    displayName: string;
    email: string;
    playerId?: string;
    whatsappNumber?: string;
    createdAt: { seconds: number; nanoseconds: number };
    hasSchoolAccess?: boolean;
};

const ADMIN_EMAILS = ['jackskkclub@gmail.com', 'guillepasqui@gmail.com'];

function UserManagement() {
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

    const handleAccessChange = async (userId: string, currentAccess: boolean) => {
        if (!firestore) return;
        const userRef = doc(firestore, 'users', userId);
        try {
            await updateDoc(userRef, {
                hasSchoolAccess: !currentAccess
            });
            toast({
                title: "Permiso actualizado",
                description: `El acceso a la escuela para el usuario ha sido ${!currentAccess ? 'concedido' : 'revocado'}.`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo actualizar el permiso.",
            });
            console.error("Error updating user access:", error);
        }
    };

    if (isLoading) {
        return <p className="text-muted-foreground">Cargando usuarios...</p>;
    }

    if (!users || users.length === 0) {
        return <p className="text-muted-foreground">No hay usuarios para mostrar.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>ID Jugador</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead>Acceso Escuela</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => {
                    const isAdmin = ADMIN_EMAILS.includes(user.email);
                    return (
                        <TableRow key={user.id} className={isAdmin ? 'bg-primary/10' : ''}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <span>{user.displayName}</span>
                                    {isAdmin && <Shield className="h-4 w-4 text-primary" title="Administrador" />}
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.playerId || 'N/A'}</TableCell>
                            <TableCell>{user.whatsappNumber || 'N/A'}</TableCell>
                            <TableCell>
                                {user.createdAt ? 
                                    format(new Date(user.createdAt.seconds * 1000), "d MMM, yyyy", { locale: es })
                                    : 'N/A'
                                }
                            </TableCell>
                            <TableCell>
                                <Switch
                                    checked={!!user.hasSchoolAccess}
                                    onCheckedChange={() => handleAccessChange(user.id, !!user.hasSchoolAccess)}
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

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

    React.useEffect(() => {
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
                    Bienvenido, {user.displayName}. Aquí puedes gestionar la aplicación.
                </p>
            </div>

            <div className="grid gap-8 max-w-5xl mx-auto">
                 <Card>
                    <CardHeader>
                        <CardTitle>Gestionar Anuncio</CardTitle>
                        <CardDescription>Publica un mensaje que aparecerá en la página de inicio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnnouncementManagement />
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Gestión de Usuarios</CardTitle>
                        <CardDescription>Ver y gestionar los usuarios registrados en la plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserManagement />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Publicaciones</CardTitle>
                        <CardDescription>Moderar análisis de manos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PostManagement />
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
