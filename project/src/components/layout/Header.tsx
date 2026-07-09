'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Spade } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { AuthButton } from '@/components/auth/auth-button';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/club', label: 'Club' },
  { href: '/community', label: 'Comunidad' },
  { href: '/school', label: 'Escuela' },
  { href: '/my-sessions', label: 'Mis Sesiones' },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="https://firebasestorage.googleapis.com/v0/b/studio-1813016982-678d4.firebasestorage.app/o/logo%2FWhatsApp%20Image%202026-01-09%20at%2016.49.50%20-%20Editado.png?alt=media&token=65f0d8b7-e444-47ea-bb84-0527b12e63dc" alt="Ace Academy Logo" width={100} height={40} />
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <AuthButton />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Menú de navegación</SheetTitle>
                  <SheetDescription>
                    Selecciona una página para navegar por el sitio.
                  </SheetDescription>
                </VisuallyHidden>
              </SheetHeader>
              <div className="mr-6 flex items-center space-x-2 mt-4">
                <Image src="https://firebasestorage.googleapis.com/v0/b/studio-1813016982-678d4.firebasestorage.app/o/logo%2FWhatsApp%20Image%202026-01-09%20at%2016.49.50%20-%20Editado.png?alt=media&token=65f0d8b7-e444-47ea-bb84-0527b12e63dc" alt="Ace Academy Logo" width={100} height={40} />
              </div>
              <div className="flex flex-col space-y-3 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'transition-colors hover:text-foreground/80 text-lg',
                      pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
