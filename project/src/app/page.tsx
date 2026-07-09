'use client';
import { Hero } from '@/components/home/Hero';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Trophy, Users, BookOpenCheck, Megaphone } from 'lucide-react';
import { useDoc, useMemoFirebase, useCollection, useFirebase } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

const featureSections = [
  {
    icon: <Trophy className="h-8 w-8 text-primary" />,
    title: "Club de Competición",
    description: "Participa en torneos exclusivos, ligas y eventos. Mide tu nivel y crece junto a los mejores.",
    link: "/club",
    linkText: "Explorar Club",
    imageId: "club"
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Comunidad Exclusiva",
    description: "Conecta con jugadores apasionados, comparte estrategias y forma parte de un equipo ganador.",
    link: "/community",
    linkText: "Ver Comunidad",
    imageId: "community"
  },
  {
    icon: <BookOpenCheck className="h-8 w-8 text-primary" />,
    title: "Escuela de Élite",
    description: "Accede a nuestro Coach de Póker IA para un análisis personalizado y domina el juego con nuestras tablas preflop interactivas.",
    link: "/school",
    linkText: "Conocer la Escuela",
    imageId: "school"
  }
];

type Announcement = {
  id: string;
  content: string;
  updatedAt?: { seconds: number };
};

function AnnouncementSection() {
    const firestore = useFirestore();
    
    const announcementDocRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'announcements', 'latest');
    }, [firestore]);

    const { data: announcement, isLoading } = useDoc<Announcement>(announcementDocRef);

    if (isLoading || !announcement || !announcement.content) {
        return null;
    }

    return (
        <section className="py-12 md:py-16 bg-background/90">
            <div className="container px-4 md:px-6">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20 bg-gradient-to-br from-background/50 to-transparent">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex items-center gap-3 mb-4">
                               <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
                                   <Megaphone className="h-6 w-6 text-primary" />
                               </div>
                               <h3 className="font-bold text-xl font-headline text-primary">Anuncio Importante</h3>
                            </div>
                            <p className="text-muted-foreground text-base max-w-3xl">{announcement.content}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

type HomeFeature = {
  id: string;
  title: string;
  description: string;
  linkText: string;
  link: string;
  imageUrl: string;
  createdAt: { seconds: number; nanoseconds: number };
};

export default function Home() {
  const { firestore } = useFirebase();

  const featuresQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'homepage-features'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: dynamicFeatures, isLoading } = useCollection<HomeFeature>(featuresQuery);

  // Use dynamic features if available, otherwise fallback to the hardcoded defaults
  const featuresToDisplay = dynamicFeatures && dynamicFeatures.length > 0 
    ? dynamicFeatures 
    : featureSections;

  return (
    <div>
      <Hero />
      <AnnouncementSection />

      <section className="py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            </div>
          ) : (
            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {featuresToDisplay.map((feature: any) => {
                // Determine if it's a dynamic feature (has imageUrl directly) or a hardcoded one (uses PlaceHolderImages)
                const isDynamic = 'imageUrl' in feature && feature.imageUrl;
                let displayImage = '';
                
                if (isDynamic) {
                  displayImage = feature.imageUrl;
                } else {
                  const placeholder = PlaceHolderImages.find((img) => img.id === feature.imageId);
                  displayImage = placeholder?.imageUrl || '';
                }

                return (
                  <Card key={feature.title || feature.id} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                    {displayImage && (
                      <div className="aspect-video relative bg-muted">
                        <Image 
                          src={displayImage} 
                          alt={feature.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                        />
                      </div>
                    )}
                    <CardHeader className="flex flex-row items-start gap-4">
                      {feature.icon && feature.icon}
                      <div className="grid gap-1">
                        <CardTitle className="font-headline">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                       <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="link" className="p-0 text-primary">
                        <Link href={feature.link}>
                          {feature.linkText}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
