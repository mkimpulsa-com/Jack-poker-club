'use client';

import { Button } from "@/components/ui/button";
import { BrainCircuit, Send, Paperclip, User, Bot, X } from "lucide-react";
import React, { useState, useRef, FormEvent, useEffect } from 'react';
import { askPokerCoach, PokerCoachInput } from '@/ai/flows/poker-coach-flow';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

type Message = {
    role: 'user' | 'assistant';
    content: string;
    image?: string;
};

const suggestionPills = [
    "¿Qué es un 3-bet?",
    "Explícame GTO",
    "¿Cómo jugar AK fuera de posición?",
    "Dame un consejo para mi próximo torneo"
];

type UserProfile = {
    hasSchoolAccess?: boolean;
}

const ADMIN_EMAILS = ['jackskkclub@gmail.com', 'guillepasqui@gmail.com'];

export default function AICoachPage() {
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    const { data: userProfile, isLoading: profileLoading } = useDoc<UserProfile>(userProfileRef);

    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "¡Hola! Soy tu Coach de Póker IA del Club Jacks. ¿En qué podemos trabajar hoy?"
        }
    ]);
    const [input, setInput] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    const handleSubmit = async (e: FormEvent, promptText?: string) => {
        if (e) e.preventDefault();
        const currentInput = promptText || input;
        if (!currentInput && !image) return;

        setIsLoading(true);
        const userMessage: Message = { role: 'user', content: currentInput };
        if (image) {
            userMessage.image = image;
        }

        // Guardamos el historial actual antes de añadir el nuevo mensaje del usuario
        const historyForIA = messages.map(m => ({ role: m.role, content: m.content }));

        setMessages(prev => [...prev, userMessage]);
        const currentImage = image;
        setInput('');
        setImage(null);

        try {
            const coachInput: PokerCoachInput = {
                message: currentInput,
                history: historyForIA,
                ...(currentImage && { photoDataUri: currentImage })
            };
            const result = await askPokerCoach(coachInput);
            setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
        } catch (error) {
            console.error("Error asking AI Coach:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, estoy teniendo problemas para conectarme. Por favor, inténtalo de nuevo más tarde." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isClient || isUserLoading || (user && profileLoading)) {
        return (
            <div className="flex h-[calc(100vh-57px)] items-center justify-center bg-[#0c0414] text-white">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-57px)] bg-[#0c0414] text-white flex flex-col relative overflow-x-hidden">
            {/* Background Gradients */}
            <div
                className="absolute top-[-50%] -right-[50%] w-[150%] h-[150%] 
                bg-gradient-radial from-primary/10 via-transparent to-transparent 
                animate-pulse -z-0"
                style={{ animationDuration: '10s' }}
            />
            <div
                className="absolute bottom-[-50%] -left-[50%] w-[150%] h-[150%] 
                bg-gradient-radial from-primary/10 via-transparent to-transparent 
                animate-pulse -z-0"
                style={{ animationDuration: '12s', animationDelay: '2s' }}
            />
            
            <div className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full z-10">
                {messages.length <= 1 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <BrainCircuit className="h-20 w-20 mx-auto text-primary animate-subtle-pulse" />
                        <h1 className="text-5xl font-bold leading-tight font-headline mt-4">
                            AI Poker Coach
                        </h1>
                        <p className="text-lg text-muted-foreground mt-2">
                           Sube una foto de una mano o hazme cualquier pregunta.
                        </p>
                         <div className="flex flex-wrap justify-center gap-2 pt-8 max-w-2xl mx-auto">
                            {suggestionPills.map((pill, index) => (
                                <button
                                    key={index}
                                    className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm transition-colors"
                                    onClick={(e) => handleSubmit(e as any, pill)}
                                    disabled={isLoading}
                                >
                                    {pill}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'assistant' && (
                                        <Avatar className="bg-primary/20 border border-primary/40">
                                            <AvatarFallback><Bot className="text-primary" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <Card className={`max-w-xl ${msg.role === 'user' ? 'bg-primary/90 text-primary-foreground' : 'bg-[#1c1528]'}`}>
                                        <CardContent className="p-4">
                                            {msg.image && (
                                                <div className="mb-2">
                                                    <Image src={msg.image} alt="User upload" width={300} height={200} className="rounded-md object-cover aspect-video" />
                                                </div>
                                            )}
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </CardContent>
                                    </Card>
                                    {msg.role === 'user' && (
                                        <Avatar>
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                               <div className="flex items-start gap-4">
                                     <Avatar className="bg-primary/20 border border-primary/40">
                                        <AvatarFallback><Bot className="text-primary" /></AvatarFallback>
                                    </Avatar>
                                    <Card className="max-w-xl bg-[#1c1528] flex items-center p-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
                                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                                        </div>
                                    </Card>
                               </div>
                            )}
                        </div>
                    </ScrollArea>
                )}

                <div className="mt-4">
                    <form onSubmit={handleSubmit} className="relative">
                        {image && (
                            <div className="absolute bottom-16 left-4 bg-[#1c1528] p-2 rounded-lg border border-primary/30 flex gap-2">
                                <div className="relative">
                                    <Image src={image} alt="Preview" width={80} height={80} className="rounded-md object-cover aspect-square" />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground p-0"
                                        onClick={removeImage}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div className="bg-[#1c1528] rounded-full p-2 flex items-center border border-primary/20 shadow-lg shadow-primary/10 h-14">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-[#2a1f3d]"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading || !!image}
                            >
                                <Paperclip className="text-gray-400" />
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <Input
                                type="text"
                                placeholder="¿Cómo te puedo ayudar hoy?"
                                className="bg-transparent flex-1 outline-none text-gray-300 pl-2 pr-12 placeholder:text-gray-500 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="bg-primary hover:bg-primary/80 rounded-full h-10 w-10"
                                disabled={isLoading || (!input && !image)}
                            >
                                <Send className="h-5 w-5" />
                                <span className="sr-only">Enviar</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
