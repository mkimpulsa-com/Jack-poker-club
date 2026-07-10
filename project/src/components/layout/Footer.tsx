import Link from 'next/link';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);


export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container max-w-screen-2xl flex flex-col items-center gap-4">
        <Image src="https://firebasestorage.googleapis.com/v0/b/club-jack-poker.firebasestorage.app/o/ChatGPT%20Image%2010%20jul%202026%2C%2010_55_53.png?alt=media&token=92fed759-c5aa-4b8f-b4b6-a001e867179e" alt="JACK'S POKER CLUB Logo" width={100} height={40} />
        <div className="flex items-center gap-4">
          <Link href="https://www.instagram.com/jackskkpokerclub?igsh=MWtrYmtoc3BrZzl5bQ%3D%3D&utm_source=qr" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="https://wa.me/5491159898633" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} JACK'S POKER CLUB. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
