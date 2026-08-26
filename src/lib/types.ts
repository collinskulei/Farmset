export type Role = "owner" | "manager";

export type AnimalStatus = "healthy" | "sick" | "pregnant" | "dry";

export type Breed =
  | "Friesian"
  | "Holstein"
  | "Ayrshire"
  | "Jersey"
  | "Guernsey"
  | "Pedigree Cross";

export type TaskStatus = "pending" | "done";

export interface Farm {
  id: string;
  name: string;
  location: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  role: Role;
  avatarInitials: string;
  farmIds: string[];
}

export interface Animal {
  id: string;
  farmId: string;
  tag: string;
  name: string;
  breed: Breed;
  sex: "female" | "male";
  birthDate: string;
  status: AnimalStatus;
  photoInitials: string;
}

export interface MedicineLog {
  id: string;
  farmId: string;
  animalId: string;
  medicine: string;
  dosage: string;
  loggedBy: string;
  loggedAt: string;
  notes?: string;
}

export interface MilkLog {
  id: string;
  farmId: string;
  animalId: string | null;
  litres: number;
  session: "morning" | "evening";
  loggedBy: string;
  loggedAt: string;
}

export interface FarmTask {
  id: string;
  farmId: string;
  title: string;
  status: TaskStatus;
  assignedTo: string;
  dueDate: string;
  completedAt?: string;
}

export interface AppNotification {
  id: string;
  farmId: string;
  type: "sick-animal" | "overdue-task" | "daily-digest";
  message: string;
  createdAt: string;
  read: boolean;
}
