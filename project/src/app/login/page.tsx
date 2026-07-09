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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { saveUserProfile } from '@/firebase/auth/user-profile';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(1, { message: 'La contraseña no puede estar vacía.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    if (!auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error de inicialización',
        description: 'El servicio de autenticación no está disponible.',
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // Actualizamos metadatos del perfil al iniciar sesión (ej. updatedAt)
      saveUserProfile(userCredential.user, firestore);
      
    } catch (error: any) {
      console.error('Error during sign-in:', error);
      let description = 'Ocurrió un error al iniciar sesión.';
      
      if (error.code?.includes('app-check-token-is-invalid')) {
        description = 'Error de App Check. Por favor, desactiva la aplicación obligatoria de App Check en la consola de Firebase para Authentication.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = 'Correo electrónico o contraseña incorrectos.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description,
      });
    }
  };

  const onGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      saveUserProfile(userCredential.user, firestore);
    } catch (error: any) {
      console.error('Error during Google sign-in:', error);
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: 'No se pudo iniciar sesión con Google.',
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
      <Card className="w-full max-sm sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold font-headline">Iniciar Sesión</CardTitle>
            <CardDescription>
              Introduce tu correo y contraseña para acceder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@correo.com" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-primary hover:underline font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  className="pr-10"
                  {...register('password')} 
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute inset-y-0 right-0 flex items-center px-3 hover:bg-transparent"
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
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
                ¿No tienes una cuenta?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                    Crear cuenta
                </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
