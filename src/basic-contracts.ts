export interface Identifiable {
  readonly id: string;
}

export type AcademicTitle = "Assistant" | "AssociateProfessor" | "Professor";

export interface Grade {
  readonly courseId: string;
  readonly score: number; // 0..100
  readonly date: Date;
}

export const PASSING_SCORE = 60;
