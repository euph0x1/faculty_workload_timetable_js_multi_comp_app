"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Book, Calendar } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/faculty', label: 'Faculty', icon: Users },
  { href: '/subjects', label: 'Subjects', icon: Book },
  { href: '/timetable', label: 'Timetable', icon: Calendar },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-accent" />
          <Link href="/" className="font-bold text-lg tracking-tight">
            Workload Wise
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80 flex items-center gap-2',
                  isActive ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                <link.icon className={cn("h-4 w-4", isActive ? 'text-accent' : '')} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
