"use client";

import { useMemo } from 'react';
import PageTitle from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppState } from '@/hooks/use-app-state';
import { DAYS, TIME_SLOTS } from '@/lib/constants';
import { type TimetableEntry } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AssignClassDialog } from '@/components/timetable/assign-class-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function TimetablePage() {
  const { timetable, faculty, subjects, deleteTimetableEntry } = useAppState();

  const timetableGrid = useMemo(() => {
    const grid: (TimetableEntry | null)[][] = Array(TIME_SLOTS.length).fill(null).map(() => Array(DAYS.length).fill(null));
    
    timetable.forEach(entry => {
      const dayIndex = DAYS.indexOf(entry.day);
      const timeSlotIndex = TIME_SLOTS.indexOf(entry.timeSlot);
      if (dayIndex !== -1 && timeSlotIndex !== -1) {
        grid[timeSlotIndex][dayIndex] = entry;
      }
    });
    return grid;
  }, [timetable]);

  const getFacultyName = (id: string) => faculty.find(f => f.id === id)?.name || 'Unknown Faculty';
  const getSubjectName = (code: string) => subjects.find(s => s.code === code)?.name || 'Unknown Subject';

  return (
    <div className="space-y-8">
      <PageTitle title="Weekly Timetable" />
      <Card>
        <CardContent className="pt-6">
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Time</TableHead>
                  {DAYS.map(day => <TableHead key={day}>{day}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {TIME_SLOTS.map((slot, timeIndex) => (
                  <TableRow key={slot}>
                    <TableCell className="font-medium">{slot}</TableCell>
                    {DAYS.map((day, dayIndex) => {
                      const entry = timetableGrid[timeIndex][dayIndex];
                      return (
                        <TableCell key={day} className="h-24 align-top p-2">
                          {entry ? (
                            <div className="bg-primary/50 p-2 rounded-md h-full flex flex-col justify-between">
                              <div>
                                <p className="font-bold text-sm text-primary-foreground">{getSubjectName(entry.subjectCode)}</p>
                                <p className="text-xs text-primary-foreground/80">{getFacultyName(entry.facultyId)}</p>
                                <Badge variant="secondary" className="mt-1">Room: {entry.room}</Badge>
                              </div>
                               <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 self-end text-destructive/70 hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this class?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will remove the class from the timetable. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteTimetableEntry(entry.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          ) : (
                            <AssignClassDialog day={day} timeSlot={slot}>
                              <Button variant="ghost" className="w-full h-full text-muted-foreground hover:bg-accent/20 hover:text-accent-foreground">
                                <PlusCircle className="h-5 w-5" />
                              </Button>
                            </AssignClassDialog>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
