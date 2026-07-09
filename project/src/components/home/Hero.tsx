import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export function Hero() {

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex flex-col items-center justify-center overflow-hidden">
      <WebGLShader />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="container px-4 md:px-6">
          <div className="relative border border-zinc-800/50 p-2">
            <main className="relative border border-zinc-800/50 py-10 overflow-hidden">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary">
                    El Póker como Deporte Mental
                </h1>
                <p className="text-lg text-white/80 md:text-xl max-w-2xl mx-auto my-6">
                    Domina la estrategia, la disciplina y la psicología del juego de élite en nuestra academia profesional.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link href="/club">
                        <LiquidButton size="xl" className="text-white border rounded-full">
                          <span className="flex items-center">
                            Únete al Club
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </span>
                        </LiquidButton>
                    </Link>
                    <Link href="/school">
                        <LiquidButton size="xl" className="text-white border border-white/30 rounded-full">
                          <span>
                            Nuestra Escuela
                          </span>
                        </LiquidButton>
                    </Link>
                </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
