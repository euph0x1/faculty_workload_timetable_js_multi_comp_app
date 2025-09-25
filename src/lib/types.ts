export interface Faculty {
  id: string;
  name: string;
  department: string;
}

export interface Subject {
  code: string;
  name:string;
  hoursPerWeek: number;
}

export interface TimetableEntry {
  id: string;
  day: string;
  timeSlot: string;
  facultyId: string;
  subjectCode: string;
  room: string;
}
