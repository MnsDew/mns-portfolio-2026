import { GraduationCap, Bot, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Qualification {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  organizationKey: string;
  roleKey: string;
  locationKey: string;
  color: string;
}

export const qualifications: Qualification[] = [
  {
    id: "student",
    icon: GraduationCap,
    titleKey: "student.title",
    organizationKey: "student.organization",
    roleKey: "student.role",
    locationKey: "student.location",
    color: "#60a5fa",
  },
  {
    id: "ai",
    icon: Bot,
    titleKey: "ai.title",
    organizationKey: "ai.organization",
    roleKey: "ai.role",
    locationKey: "ai.location",
    color: "#a78bfa",
  },
  {
    id: "teacher",
    icon: BookOpen,
    titleKey: "teacher.title",
    organizationKey: "teacher.organization",
    roleKey: "teacher.role",
    locationKey: "teacher.location",
    color: "#34d399",
  },
];
