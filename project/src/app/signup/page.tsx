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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveUserProfile } from '@/firebase/auth/user-profile';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const signupSchema = z.object({
  displayName: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
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
  const [showPassword, setShowPassword] = useState(false);

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
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, {
        displayName: data.displayName
      });
      
      // Guardamos el perfil explícitamente marcándolo como usuario nuevo
      saveUserProfile(firebaseUser, firestore, { 
        playerId: data.playerId,
        whatsappNumber: data.whatsappNumber
      }, true);

      toast({
        title: '¡Cuenta creada!',
        description: 'Tu perfil ha sido configurado correctamente.',
      });

    } catch (error: any) {
      console.error('Error during sign-up:', error);
      let description = 'Ocurrió un error al crear la cuenta.';
      
      if (error.code?.includes('app-check-token-is-invalid')) {
        description = 'Error de App Check. Por favor, desactiva la aplicación obligatoria de App Check en la consola de Firebase para Authentication.';
      } else if (error.code === 'auth/email-already-in-use') {
        description = 'Este correo electrónico ya está en uso.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Error de registro',
        description,
      });
    }
  };

  const onGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // When registering with Google, we might not have playerId or whatsappNumber immediately,
      // but we still save the profile.
      saveUserProfile(userCredential.user, firestore, {}, true);

      toast({
        title: '¡Cuenta creada!',
        description: 'Tu perfil con Google ha sido configurado correctamente.',
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
              Introduce tus datos para registrarte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="displayName">Nombre</Label>
                <Input id="displayName" type="text" placeholder="Tu nombre" {...register('displayName')} />
                {errors.displayName && <p className="text-sm text-destructive">{errors.displayName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@correo.com" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  {...register('password')} 
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
            
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O continuar con</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full font-bold" onClick={onGoogleSignIn}>
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Google
            </Button>

             <p className="text-sm text-muted-foreground">
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
