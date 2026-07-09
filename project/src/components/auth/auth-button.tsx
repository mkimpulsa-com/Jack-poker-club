'use client';
import React from 'react';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const ADMIN_EMAILS = ['jackskkclub@gmail.com', 'guillepasqui@gmail.com', 'robertemprende000@gmail.com'];

function UserButton() {
  const { user } = useUser();
  const auth = useAuth();

  if (!user || !auth) {
    return null;
  }

  const isAdmin = ADMIN_EMAILS.includes(user.email || '');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback>
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => signOut(auth)}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AuthButton() {
    const { user, isUserLoading } = useUser();

    if (isUserLoading) {
        return <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />;
    }

    if (user) {
        return <UserButton />;
    }

    return (
        <Button asChild>
            <Link href="/login">
                Iniciar sesión
            </Link>
        </Button>
    );
}
