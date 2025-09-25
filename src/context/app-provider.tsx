"use client";

import type { Faculty, Subject, TimetableEntry } from "@/lib/types";
import { createContext, useState, type ReactNode } from "react";

// Initial data for demonstration
const initialFaculty: Faculty[] = [
  { id: 'F001', name: 'Dr. Alan Turing', department: 'Computer Science' },
  { id: 'F002', name: 'Dr. Marie Curie', department: 'Physics' },
  { id: 'F003', name: 'Dr. Ada Lovelace', department: 'Mathematics' },
];

const initialSubjects: Subject[] = [
  { code: 'CS101', name: 'Intro to Programming', hoursPerWeek: 4 },
  { code: 'PY201', name: 'Quantum Mechanics', hoursPerWeek: 3 },
  { code: 'MA301', name: 'Advanced Calculus', hoursPerWeek: 3 },
];

const initialTimetable: TimetableEntry[] = [
    { id: 't1', day: 'Monday', timeSlot: '09:00 - 10:00', facultyId: 'F001', subjectCode: 'CS101', room: '101' },
    { id: 't2', day: 'Tuesday', timeSlot: '11:00 - 12:00', facultyId: 'F002', subjectCode: 'PY201', room: '202' },
];

interface AppContextType {
  faculty: Faculty[];
  addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
  deleteFaculty: (id: string) => void;
  subjects: Subject[];
  addSubject: (subject: Subject) => void;
  deleteSubject: (code: string) => void;
  timetable: TimetableEntry[];
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  deleteTimetableEntry: (id: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [faculty, setFaculty] = useState<Faculty[]>(initialFaculty);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable);

  const addFaculty = (newFaculty: Omit<Faculty, 'id'>) => {
    setFaculty(prev => [...prev, { ...newFaculty, id: `F${Date.now()}` }]);
  };

  const deleteFaculty = (id: string) => {
    setFaculty(prev => prev.filter(f => f.id !== id));
    setTimetable(prev => prev.filter(t => t.facultyId !== id));
  };

  const addSubject = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject]);
  };

  const deleteSubject = (code: string) => {
    setSubjects(prev => prev.filter(s => s.code !== code));
    setTimetable(prev => prev.filter(t => t.subjectCode !== code));
  };

  const addTimetableEntry = (newEntry: Omit<TimetableEntry, 'id'>) => {
    setTimetable(prev => [...prev, { ...newEntry, id: `T${Date.now()}` }]);
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetable(prev => prev.filter(t => t.id !== id));
  };
  
  const value = {
    faculty,
    addFaculty,
    deleteFaculty,
    subjects,
    addSubject,
    deleteSubject,
    timetable,
    addTimetableEntry,
    deleteTimetableEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
