'use client';

import { motion } from 'framer-motion';
import { Users, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

const benefits = [
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: "Análisis de Manos",
    description: "Sube tus manos, comparte tus dudas y recibe feedback de la comunidad y nuestros coaches para mejorar tu juego.",
    link: "/community/hand-analysis"
  }
];

export default function CommunityPage() {
    const title = "Nuestra Comunidad";
    const words = title.split(" ");

    return (
        <div>
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
                            <Users className="h-16 w-16 mx-auto text-primary mb-8" />
                        </motion.div>
    
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 tracking-tighter">
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
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto"
                        >
                          El póker es un viaje. No lo hagas solo. Únete a una comunidad de jugadores que comparten tu misma pasión y ambición por crecer.
                        </motion.p>
                    </motion.div>
                </div>
            </div>

            <div className="container py-12 md:py-16 -mt-32 relative z-20">
                <div className="grid gap-8 md:grid-cols-1 max-w-md mx-auto">
                    {benefits.map((benefit) => (
                      <Card key={benefit.title} className="bg-card/50 backdrop-blur-sm flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4">
                          {benefit.icon}
                          <CardTitle className="font-headline">{benefit.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-muted-foreground">{benefit.description}</p>
                        </CardContent>
                        {benefit.link && (
                          <CardFooter>
                            <Button asChild className="w-full font-bold">
                              <Link href={benefit.link}>
                                Ir a {benefit.title}
                              </Link>
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}