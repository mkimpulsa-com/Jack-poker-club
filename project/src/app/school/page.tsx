'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpenCheck, BrainCircuit, BarChart, TrendingUp, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

type UserProfile = {
    hasSchoolAccess?: boolean;
}

const ADMIN_EMAILS = ['jackskkclub@gmail.com', 'guillepasqui@gmail.com'];

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-slate-950 dark:text-white"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}


export default function SchoolPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    const { data: userProfile, isLoading: profileLoading } = useDoc<UserProfile>(userProfileRef);

    const title = "Nuestra Escuela de Póker";
    const words = title.split(" ");
    
    if (isUserLoading || (user && profileLoading)) {
        return (
            <div className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
                <p>Cargando...</p>
            </div>
        );
    }



    return (
         <div className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
            <div className="absolute inset-0 pointer-events-none">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            delay: 0.1,
                            type: "spring",
                            stiffness: 150,
                            damping: 25,
                        }}
                    >
                         <BookOpenCheck className="h-16 w-16 mx-auto text-primary mb-8" />
                    </motion.div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-12 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                0.2 +
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                                        dark:from-white dark:to-white/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex flex-wrap justify-center items-center gap-6"
                    >
                        <Link href="/school/ai-coach">
                            <div
                                className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                                dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                                overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <Button
                                    variant="ghost"
                                    className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                                    bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                                    text-black dark:text-white transition-all duration-300 
                                    group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                                    hover:shadow-md dark:hover:shadow-neutral-800/50 flex items-center"
                                >
                                    <BrainCircuit className="mr-3 h-6 w-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                        Coach IA
                                    </span>
                                </Button>
                            </div>
                        </Link>
                        
                        <Link href="/school/preflop-charts">
                             <div
                                className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                                dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                                overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <Button
                                    variant="ghost"
                                    className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                                    bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                                    text-black dark:text-white transition-all duration-300 
                                    group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                                    hover:shadow-md dark:hover:shadow-neutral-800/50 flex items-center"
                                >
                                    <BarChart className="mr-3 h-6 w-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                        Tablas Preflop IA
                                    </span>
                                </Button>
                            </div>
                        </Link>
                        
                        <Link href="/school/dictionary">
                             <div
                                className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                                dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                                overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <Button
                                    variant="ghost"
                                    className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                                    bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                                    text-black dark:text-white transition-all duration-300 
                                    group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                                    hover:shadow-md dark:hover:shadow-neutral-800/50 flex items-center"
                                >
                                    <BookOpenCheck className="mr-3 h-6 w-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                        Diccionario
                                    </span>
                                </Button>
                            </div>
                        </Link>
                        
                        <Link href="/my-sessions">
                             <div
                                className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                                dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                                overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <Button
                                    variant="ghost"
                                    className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                                    bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                                    text-black dark:text-white transition-all duration-300 
                                    group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                                    hover:shadow-md dark:hover:shadow-neutral-800/50 flex items-center"
                                >
                                    <TrendingUp className="mr-3 h-6 w-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                        Mis Sesiones
                                    </span>
                                </Button>
                            </div>
                        </Link>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div
                                    className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                                    dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                                    overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                >
                                    <Button
                                        variant="ghost"
                                        className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                                        bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                                        text-black dark:text-white transition-all duration-300 
                                        group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                                        hover:shadow-md dark:hover:shadow-neutral-800/50 flex items-center"
                                    >
                                        <Gamepad2 className="mr-3 h-6 w-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                            Visual Poker Trainer
                                        </span>
                                    </Button>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                align="center" 
                                className="w-64 p-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-2xl"
                            >
                                <DropdownMenuItem asChild className="cursor-pointer rounded-xl mb-1 hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10 transition-all duration-200 p-0 border border-transparent hover:border-black/5 dark:hover:border-white/10">
                                    <Link href="/school/visual-trainer/spin" className="flex items-center w-full px-4 py-3">
                                        <div className="bg-black/5 dark:bg-white/10 rounded-full p-2 mr-3">
                                            <Gamepad2 className="w-4 h-4 text-black dark:text-white opacity-80" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-black dark:text-white">Entrenador Spin</span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">Mesa corta (3-Max)</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer rounded-xl hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10 transition-all duration-200 p-0 border border-transparent hover:border-black/5 dark:hover:border-white/10">
                                    <Link href="/school/visual-trainer/max-8" className="flex items-center w-full px-4 py-3">
                                        <div className="bg-black/5 dark:bg-white/10 rounded-full p-2 mr-3">
                                            <Gamepad2 className="w-4 h-4 text-black dark:text-white opacity-80" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-black dark:text-white">Entrenador Max 8</span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">Mesa larga (8-Max)</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
