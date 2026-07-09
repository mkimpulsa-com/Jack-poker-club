'use client';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit } from "lucide-react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { useFirebase, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

type FormValues = {
    title: string;
    description: string;
};

type Post = {
    id: string;
    title: string;
    description: string;
    authorId: string;
    authorName: string;
    authorPhotoUrl: string;
    createdAt: { seconds: number; nanoseconds: number };
    commentCount?: number;
};


export default function HandAnalysisPage() {
    const { firestore } = useFirebase();
    const { user } = useUser();
    const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<FormValues>();
    const [formError, setFormError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const postsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const postsCollection = collection(firestore, 'hand-analysis-posts');
        return query(postsCollection, orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: posts, isLoading: postsLoading } = useCollection<Post>(postsQuery);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setFormError(null);
        if (!user) {
            setFormError("Debes iniciar sesión para publicar una mano.");
            return;
        }
        if (!firestore) {
            setFormError("No se pudo conectar a la base de datos.");
            return;
        }

        try {
            const postData: any = {
                title: data.title,
                description: data.description,
                authorId: user.uid,
                authorName: user.displayName,
                authorPhotoUrl: user.photoURL,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(firestore, 'hand-analysis-posts'), postData);

            reset();
        } catch (error) {
            console.error("Error publishing hand:", error);
            setFormError("Ocurrió un error al publicar la mano. Por favor, inténtalo de nuevo.");
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="container py-12 md:py-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <BrainCircuit className="h-16 w-16 mx-auto text-primary mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
                    Análisis de Manos
                </h1>
                <p className="text-lg text-muted-foreground">
                    Sube tus manos, comparte tus dudas y recibe feedback de la comunidad y nuestros coaches para mejorar tu juego.
                </p>
            </div>

            <Card className="max-w-2xl mx-auto mb-12">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Publicar una nueva mano</CardTitle>
                        <CardDescription>Describe la situación, tus acciones y tu duda principal.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Título de la mano (ej. AQ en BB vs BTN open)"
                            {...register("title", { required: "El título es obligatorio." })}
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}

                        <Textarea
                            placeholder="Describe la mano en detalle. Incluye stacks, posición, acción preflop, flop, turn y river..."
                            rows={6}
                            {...register("description", { required: "La descripción es obligatoria." })}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}

                        {formError && <p className="text-sm text-destructive">{formError}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full md:w-auto ml-auto font-bold" disabled={isSubmitting || !user}>
                            {isSubmitting ? 'Publicando...' : (user ? 'Publicar Mano' : 'Inicia sesión para publicar')}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <div className="max-w-2xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold font-headline text-center">Manos de la Comunidad</h2>

                {postsLoading && <p className='text-center'>Cargando publicaciones...</p>}
                
                {!postsLoading && posts && posts.length === 0 && (
                    <p className="text-center text-muted-foreground">Todavía no hay publicaciones. ¡Sé el primero en compartir una mano!</p>
                )}

                {posts && posts.map((post) => (
                    <Card key={post.id} className="bg-card/50">
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={post.authorPhotoUrl} alt={post.authorName} />
                                    <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{post.authorName}</span>
                                <span>•</span>
                                <span>
                                    {post.createdAt ? 
                                        formatDistanceToNow(new Date(post.createdAt.seconds * 1000), { addSuffix: true, locale: es })
                                        : 'hace un momento'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {post.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
