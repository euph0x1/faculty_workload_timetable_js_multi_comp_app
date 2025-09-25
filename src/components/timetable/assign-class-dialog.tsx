"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppState } from "@/hooks/use-app-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface AssignClassDialogProps {
  day: string;
  timeSlot: string;
  children: React.ReactNode;
}

const assignClassSchema = z.object({
  facultyId: z.string().min(1, "Please select a faculty member"),
  subjectCode: z.string().min(1, "Please select a subject"),
  room: z.string().min(1, "Room number is required"),
});

type AssignClassFormValues = z.infer<typeof assignClassSchema>;

export function AssignClassDialog({ day, timeSlot, children }: AssignClassDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { faculty, subjects, timetable, addTimetableEntry } = useAppState();
  const { toast } = useToast();

  const form = useForm<AssignClassFormValues>({
    resolver: zodResolver(assignClassSchema),
    defaultValues: { facultyId: "", subjectCode: "", room: "" },
  });

  const onSubmit: SubmitHandler<AssignClassFormValues> = (data) => {
    // Conflict detection
    const facultyConflict = timetable.some(
      entry => entry.day === day && entry.timeSlot === timeSlot && entry.facultyId === data.facultyId
    );
    if (facultyConflict) {
      toast({
        title: "Conflict Detected",
        description: "This faculty member is already assigned to another class at this time.",
        variant: "destructive",
      });
      return;
    }

    const roomConflict = timetable.some(
      entry => entry.day === day && entry.timeSlot === timeSlot && entry.room === data.room
    );
    if (roomConflict) {
      toast({
        title: "Conflict Detected",
        description: `Room ${data.room} is already booked at this time.`,
        variant: "destructive",
      });
      return;
    }

    const subject = subjects.find(s => s.code === data.subjectCode);
    const scheduledHours = timetable.filter(t => t.subjectCode === data.subjectCode).length;
    if (subject && scheduledHours >= subject.hoursPerWeek) {
       toast({
        title: "Workload Warning",
        description: `${subject.name} has already met its weekly hours.`,
      });
    }

    addTimetableEntry({ ...data, day, timeSlot });
    toast({
      title: "Class Assigned",
      description: "The class has been successfully added to the timetable.",
    });
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Class</DialogTitle>
          <DialogDescription>
            Assign a faculty, subject, and room for {day} at {timeSlot}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="facultyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a faculty member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {faculty.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="subjectCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map(s => (
                        <SelectItem key={s.code} value={s.code}>{s.name} ({s.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 101, Lab A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Assign</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
