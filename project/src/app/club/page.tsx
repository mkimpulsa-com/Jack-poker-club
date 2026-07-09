import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function ClubPage() {
  const image = PlaceHolderImages.find((img) => img.id === 'club-hero');
  const backgroundImage = 'https://firebasestorage.googleapis.com/v0/b/studio-1813016982-678d4.firebasestorage.app/o/Seccion%20Club%2Fhome-small-blue.jpg?alt=media&token=d6360763-7a62-4da2-a38f-fe4537cdd128';
  const chipTop = 'https://firebasestorage.googleapis.com/v0/b/studio-1813016982-678d4.firebasestorage.app/o/Seccion%20Club%2Fchip2.png?alt=media&token=a912f3e5-75d2-4874-8c8d-7d9d30e8d10f';
  const chipBottom = 'https://firebasestorage.googleapis.com/v0/b/studio-1813016982-678d4.firebasestorage.app/o/Seccion%20Club%2Fchip1.png?alt=media&token=974a659f-698f-435e-aad5-70b8dec25d62';

  return (
    <div className="relative text-white overflow-hidden">
      <Image
        src={backgroundImage}
        alt="Fondo de poker"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />

      <Image
        src={chipTop}
        alt="Ficha de poker"
        width={200}
        height={200}
        className="absolute bottom-10 left-1/4 transform -translate-x-1/2 z-20 opacity-80 animate-float-up"
      />
      <Image
        src={chipBottom}
        alt="Ficha de poker"
        width={200}
        height={200}
        className="absolute top-1/2 right-[20%] transform -translate-y-1/2 z-20 opacity-80 animate-float-down"
      />

      <div className="relative z-10 container mx-auto grid min-h-[80vh] grid-cols-1 items-center gap-12 px-4 py-12 md:grid-cols-2 md:py-24">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
            PÓKER DIVERTIDO, SEGURO Y RECOMPENSANTE
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
            ¡Descárgala ahora para disfrutar de la MEJOR app de póker, ofreciendo una selección inigualable de diversión en póker en línea para todos los jugadores!
          </p>
          <div className="flex justify-center md:justify-start">
            <Button asChild size="lg" className="bg-primary font-bold text-primary-foreground hover:bg-primary/90">
              <Link href="https://kkpoker.club/jacks" target="_blank" rel="noopener noreferrer">
                DESCARGAR AHORA
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          {image && (
            <Image
              src={image.imageUrl}
              alt={image.description}
              width={400}
              height={800}
              className="rounded-lg object-contain animate-subtle-pulse"
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
      </div>
    </div>
  );
}
