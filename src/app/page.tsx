"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppState } from '@/hooks/use-app-state';
import { Users, Book, Calendar, CheckSquare, LayoutGrid } from 'lucide-react';
import PageTitle from '@/components/page-title';

export default function Dashboard() {
  const { faculty, subjects, timetable } = useAppState();

  const totalSlots = 5 * 8; // 5 days, 8 slots per day
  const filledSlots = timetable.length;
  const freeSlots = totalSlots - filledSlots;

  const stats = [
    { title: 'Total Faculty', value: faculty.length, icon: <Users className="h-6 w-6 text-accent" /> },
    { title: 'Total Subjects', value: subjects.length, icon: <Book className="h-6 w-6 text-accent" /> },
    { title: 'Filled Slots', value: filledSlots, icon: <CheckSquare className="h-6 w-6 text-accent" /> },
    { title: 'Free Slots', value: freeSlots, icon: <LayoutGrid className="h-6 w-6 text-accent" /> },
  ];

  const navLinks = [
    { href: '/faculty', title: 'Manage Faculty', icon: <Users className="h-8 w-8 text-primary-foreground" /> },
    { href: '/subjects', title: 'Manage Subjects', icon: <Book className="h-8 w-8 text-primary-foreground" /> },
    { href: '/timetable', title: 'View Timetable', icon: <Calendar className="h-8 w-8 text-primary-foreground" /> },
  ];

  return (
    <div className="space-y-8">
      <PageTitle title="Dashboard" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {navLinks.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className="block transition-transform hover:scale-105"
          >
            <Card className="bg-accent text-accent-foreground hover:bg-accent/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  {link.icon}
                  <span>{link.title}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
