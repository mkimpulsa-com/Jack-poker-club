'use client';

import React from 'react';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ChevronLeft, Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    if (!auth) return;

    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: 'Correo enviado',
        description: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.',
      });
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo enviar el correo de recuperación. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-57px)] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
            </div>
            <CardTitle className="text-2xl font-bold font-headline">Recuperar Contraseña</CardTitle>
            <CardDescription>
              Introduce tu correo y te enviaremos un enlace para restablecer tu acceso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="tu@correo.com" 
                {...register('email')} 
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
            </Button>
            <Button variant="ghost" asChild className="w-full">
                <Link href="/login">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Volver al inicio de sesión
                </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
