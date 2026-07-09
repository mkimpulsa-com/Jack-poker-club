'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useDoc, useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, orderBy, increment, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { BrainCircuit, MessageCircle, Send } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

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

type Comment = {
    id: string;
    authorId: string;
    authorName: string;
    authorPhotoUrl: string;
    content: string;
    createdAt: { seconds: number; nanoseconds: number };
};

type CommentFormValues = {
    content: string;
};

function CommentForm({ postId }: { postId: string }) {
    const { firestore } = useFirebase();
    const { user } = useUser();
    const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<CommentFormValues>();
    const [formError, setFormError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<CommentFormValues> = async (data) => {
        setFormError(null);
        if (!user || !firestore) {
            setFormError("Debes iniciar sesión para comentar.");
            return;
        }

        try {
            const commentsCollection = collection(firestore, 'hand-analysis-posts', postId, 'comments');
            const postRef = doc(firestore, 'hand-analysis-posts', postId);

            const newComment = {
                authorId: user.uid,
                authorName: user.displayName,
                authorPhotoUrl: user.photoURL,
                content: data.content,
                createdAt: serverTimestamp(),
            };

            await addDoc(commentsCollection, newComment);
            
            // Increment the comment count on the post
            await updateDoc(postRef, {
                commentCount: increment(1)
            }).catch(err => {
                // This might fail if the user is not the post owner due to security rules.
                // We catch it to prevent the UI from crashing. The comment is still created.
                console.warn("Could not update comment count:", err.message);
            });

            reset();
        } catch (error: any) {
            console.error("Error adding comment:", error);
            setFormError("No se pudo agregar el comentario. Inténtalo de nuevo.");
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Agregar un comentario</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Escribe tu análisis, pregunta o consejo..."
                        rows={4}
                        {...register("content", { required: "El comentario no puede estar vacío." })}
                        disabled={!user || isSubmitting}
                    />
                    {errors.content && <p className="text-sm text-destructive mt-2">{errors.content.message}</p>}
                    {formError && <p className="text-sm text-destructive mt-2">{formError}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={!user || isSubmitting}>
                        {isSubmitting ? 'Comentando...' : 'Comentar'}
                        <Send className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default function PostPage() {
    const params = useParams();
    const postId = params.postId as string;
    const { firestore } = useFirebase();

    const postRef = useMemoFirebase(() => {
        if (!firestore || !postId) return null;
        return doc(firestore, 'hand-analysis-posts', postId);
    }, [firestore, postId]);

    const commentsQuery = useMemoFirebase(() => {
        if (!firestore || !postId) return null;
        return query(collection(firestore, 'hand-analysis-posts', postId, 'comments'), orderBy('createdAt', 'asc'));
    }, [firestore, postId]);

    const { data: post, isLoading: postLoading } = useDoc<Post>(postRef);
    const { data: comments, isLoading: commentsLoading } = useCollection<Comment>(commentsQuery);

    if (postLoading) {
        return <div className="container text-center py-16">Cargando publicación...</div>;
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="container py-12 md:py-16">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Post Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold font-headline">{post.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={post.authorPhotoUrl} alt={post.authorName} />
                                <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{post.authorName}</span>
                            <span>•</span>
                            <span>
                                {post.createdAt ?
                                    format(new Date(post.createdAt.seconds * 1000), "d 'de' MMMM, yyyy", { locale: es })
                                    : 'N/A'}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                            {post.description}
                        </p>
                    </CardContent>
                </Card>
                
                {/* Comment Form */}
                <CommentForm postId={postId} />
                
                {/* Comments Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
                        <MessageCircle />
                        Comentarios ({comments?.length || 0})
                    </h2>
                    
                    {commentsLoading && <p>Cargando comentarios...</p>}

                    {!commentsLoading && comments && comments.length === 0 && (
                        <p className="text-muted-foreground">Todavía no hay comentarios. ¡Sé el primero en responder!</p>
                    )}

                    {comments && comments.map(comment => (
                        <Card key={comment.id} className="bg-card/50">
                            <CardHeader>
                               <div className="flex items-center gap-3">
                                   <Avatar className="h-9 w-9">
                                        <AvatarImage src={comment.authorPhotoUrl} alt={comment.authorName} />
                                        <AvatarFallback>{comment.authorName?.charAt(0)}</AvatarFallback>
                                   </Avatar>
                                   <div>
                                       <p className="font-semibold">{comment.authorName}</p>
                                       <p className="text-xs text-muted-foreground">
                                           {comment.createdAt ?
                                               formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true, locale: es })
                                               : 'hace un momento'}
                                       </p>
                                   </div>
                               </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
