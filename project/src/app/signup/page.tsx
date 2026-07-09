'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveUserProfile } from '@/firebase/auth/user-profile';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const signupSchema = z.object({
  playerId: z.string().min(1, { message: 'El ID de jugador es obligatorio.' }),
  whatsappNumber: z.string().min(1, { message: 'El número de WhatsApp es obligatorio.' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    if (!auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error de inicialización',
        description: 'Los servicios de Firebase no están disponibles.',
      });
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      saveUserProfile(userCredential.user, firestore, { 
        playerId: data.playerId,
        whatsappNumber: data.whatsappNumber
      }, true);

      toast({
        title: '¡Cuenta creada!',
        description: 'Tu perfil ha sido configurado correctamente.',
      });

    } catch (error: any) {
      console.error('Error during Google sign-in:', error);
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: 'No se pudo crear la cuenta con Google.',
      });
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-[calc(100vh-57px)] items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-57px)] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold font-headline">Crear una cuenta</CardTitle>
            <CardDescription>
              Introduce tus datos y regístrate con Google.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="playerId">ID de Jugador</Label>
                <Input id="playerId" type="text" placeholder="Tu ID en la plataforma" {...register('playerId')} />
                {errors.playerId && <p className="text-sm text-destructive">{errors.playerId.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="whatsappNumber">Número de WhatsApp</Label>
                <Input id="whatsappNumber" type="text" placeholder="Tu número de contacto" {...register('whatsappNumber')} />
                {errors.whatsappNumber && <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" variant="outline" className="w-full font-bold" disabled={isSubmitting}>
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              {isSubmitting ? 'Conectando con Google...' : 'Registrarse con Google'}
            </Button>
            
             <p className="text-sm text-muted-foreground text-center">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Iniciar sesión
                </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
