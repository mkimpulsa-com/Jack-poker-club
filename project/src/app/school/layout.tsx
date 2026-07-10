'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const isSchoolRoot = pathname === '/school';

    return (
        <div className="relative w-full min-h-[calc(100vh-64px)]">
            {!isSchoolRoot && (
                <div className="absolute top-4 left-4 md:top-6 md:left-8 z-[100]">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => router.push('/school')}
                        className="bg-black/50 backdrop-blur-md text-white border border-white/10 hover:bg-black/70 shadow-xl transition-all"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a la Escuela
                    </Button>
                </div>
            )}
            {children}
        </div>
    );
}
