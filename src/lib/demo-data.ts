import type {
  Animal,
  AppNotification,
  Farm,
  FarmTask,
  MedicineLog,
  MilkLog,
  Profile,
} from "@/lib/types";

// Static, hand-authored demo dataset so the prototype is clickable without
// live Supabase credentials. Shape mirrors the real schema (see supabase/schema.sql)
// so swapping this module for real queries later is a drop-in change.

export const demoProfile: Profile = {
  id: "owner-1",
  name: "Dominic Njoka",
  role: "owner",
  avatarInitials: "DN",
  farmIds: ["farm-1", "farm-2"],
};

export const demoFarms: Farm[] = [
  {
    id: "farm-1",
    name: "Kiambu Road Farm",
    location: "Kiambu County",
    createdAt: "2026-01-12",
  },
  {
    id: "farm-2",
    name: "Ruiru Highlands Farm",
    location: "Kiambu County",
    createdAt: "2026-03-04",
  },
];

export const demoManagers = [
  { id: "mgr-1", name: "Peter Mwangi", farmIds: ["farm-1"] },
  { id: "mgr-2", name: "Grace Wambui", farmIds: ["farm-1", "farm-2"] },
];

export const demoAnimals: Animal[] = [
  {
    id: "an-1",
    farmId: "farm-1",
    tag: "KR-014",
    name: "Malaika",
    breed: "Friesian",
    sex: "female",
    birthDate: "2022-04-18",
    status: "sick",
    photoInitials: "MA",
  },
  {
    id: "an-2",
    farmId: "farm-1",
    tag: "KR-021",
    name: "Zawadi",
    breed: "Holstein",
    sex: "female",
    birthDate: "2021-11-02",
    status: "healthy",
    photoInitials: "ZA",
  },
  {
    id: "an-3",
    farmId: "farm-1",
    tag: "KR-033",
    name: "Amani",
    breed: "Jersey",
    sex: "female",
    birthDate: "2023-06-09",
    status: "pregnant",
    photoInitials: "AM",
  },
  {
    id: "an-4",
    farmId: "farm-1",
    tag: "KR-041",
    name: "Bahati",
    breed: "Pedigree Cross",
    sex: "male",
    birthDate: "2024-02-27",
    status: "healthy",
    photoInitials: "BA",
  },
  {
    id: "an-5",
    farmId: "farm-2",
    tag: "RH-007",
    name: "Neema",
    breed: "Ayrshire",
    sex: "female",
    birthDate: "2020-09-15",
    status: "dry",
    photoInitials: "NE",
  },
  {
    id: "an-6",
    farmId: "farm-2",
    tag: "RH-012",
    name: "Furaha",
    breed: "Guernsey",
    sex: "female",
    birthDate: "2022-12-01",
    status: "healthy",
    photoInitials: "FU",
  },
];

export const demoMedicineLogs: MedicineLog[] = [
  {
    id: "med-1",
    farmId: "farm-1",
    animalId: "an-1",
    medicine: "Oxytetracycline",
    dosage: "10ml IM",
    loggedBy: "Peter Mwangi",
    loggedAt: "2026-08-25T07:40:00+03:00",
    notes: "Mild fever, isolated in sick bay, recheck tomorrow.",
  },
  {
    id: "med-2",
    farmId: "farm-1",
    animalId: "an-3",
    medicine: "Multivitamin booster",
    dosage: "5ml SC",
    loggedBy: "Grace Wambui",
    loggedAt: "2026-08-24T16:05:00+03:00",
  },
  {
    id: "med-3",
    farmId: "farm-2",
    animalId: "an-5",
    medicine: "Deworming (Albendazole)",
    dosage: "15ml oral",
    loggedBy: "Grace Wambui",
    loggedAt: "2026-08-23T09:15:00+03:00",
  },
];

export const demoMilkLogs: MilkLog[] = [
  { id: "milk-1", farmId: "farm-1", animalId: "an-2", litres: 14.5, session: "morning", loggedBy: "Peter Mwangi", loggedAt: "2026-08-26T06:30:00+03:00" },
  { id: "milk-2", farmId: "farm-1", animalId: "an-3", litres: 9.2, session: "morning", loggedBy: "Peter Mwangi", loggedAt: "2026-08-26T06:35:00+03:00" },
  { id: "milk-3", farmId: "farm-1", animalId: "an-2", litres: 12.8, session: "evening", loggedBy: "Grace Wambui", loggedAt: "2026-08-25T17:50:00+03:00" },
  { id: "milk-4", farmId: "farm-2", animalId: "an-6", litres: 11.4, session: "morning", loggedBy: "Grace Wambui", loggedAt: "2026-08-26T06:50:00+03:00" },
  { id: "milk-5", farmId: "farm-1", animalId: "an-2", litres: 13.9, session: "morning", loggedBy: "Peter Mwangi", loggedAt: "2026-08-25T06:28:00+03:00" },
  { id: "milk-6", farmId: "farm-1", animalId: "an-3", litres: 8.7, session: "evening", loggedBy: "Grace Wambui", loggedAt: "2026-08-24T18:02:00+03:00" },
];

export const demoTasks: FarmTask[] = [
  {
    id: "task-1",
    farmId: "farm-1",
    title: "Scrape & clean main shed",
    status: "done",
    assignedTo: "Peter Mwangi",
    dueDate: "2026-08-26",
    completedAt: "2026-08-26T07:10:00+03:00",
  },
  {
    id: "task-2",
    farmId: "farm-1",
    title: "Refill water troughs — paddock 2",
    status: "pending",
    assignedTo: "Grace Wambui",
    dueDate: "2026-08-26",
  },
  {
    id: "task-3",
    farmId: "farm-1",
    title: "Vet follow-up visit for Malaika",
    status: "pending",
    assignedTo: "Peter Mwangi",
    dueDate: "2026-08-27",
  },
  {
    id: "task-4",
    farmId: "farm-2",
    title: "Repair fence — north boundary",
    status: "pending",
    assignedTo: "Grace Wambui",
    dueDate: "2026-08-25",
  },
  {
    id: "task-5",
    farmId: "farm-2",
    title: "Clean milking parlour",
    status: "done",
    assignedTo: "Grace Wambui",
    dueDate: "2026-08-26",
    completedAt: "2026-08-26T06:15:00+03:00",
  },
];

export const demoNotifications: AppNotification[] = [
  {
    id: "notif-1",
    farmId: "farm-1",
    type: "sick-animal",
    message: "Malaika (KR-014) flagged sick by Peter Mwangi — Oxytetracycline administered.",
    createdAt: "2026-08-25T07:41:00+03:00",
    read: false,
  },
  {
    id: "notif-2",
    farmId: "farm-2",
    type: "overdue-task",
    message: "\"Repair fence — north boundary\" is overdue at Ruiru Highlands Farm.",
    createdAt: "2026-08-26T06:00:00+03:00",
    read: false,
  },
  {
    id: "notif-3",
    farmId: "farm-1",
    type: "daily-digest",
    message: "Yesterday: 26.7L milk logged, 1 task completed, 1 medicine log.",
    createdAt: "2026-08-26T06:00:00+03:00",
    read: true,
  },
];

export function getAnimalById(id: string) {
  return demoAnimals.find((a) => a.id === id);
}

export function getFarmById(id: string) {
  return demoFarms.find((f) => f.id === id);
}

export function animalsForFarm(farmId: string) {
  return demoAnimals.filter((a) => a.farmId === farmId);
}

export function medicineLogsForAnimal(animalId: string) {
  return demoMedicineLogs.filter((m) => m.animalId === animalId);
}

export function milkLogsForAnimal(animalId: string) {
  return demoMilkLogs.filter((m) => m.animalId === animalId);
}

export function tasksForFarm(farmId: string) {
  return demoTasks.filter((t) => t.farmId === farmId);
}

export function notificationsForFarms(farmIds: string[]) {
  return demoNotifications.filter((n) => farmIds.includes(n.farmId));
}

export function milkTotalForFarm(farmId: string) {
  return demoMilkLogs
    .filter((m) => m.farmId === farmId)
    .reduce((sum, m) => sum + m.litres, 0);
}
