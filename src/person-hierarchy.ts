import { Identifiable, AcademicTitle, Grade, PASSING_SCORE } from "./basic-contracts.js";

export abstract class Person implements Identifiable {
  constructor(
    public readonly id: string,
    public firstName: string,
    public lastName: string,
    private _email: string
  ) {
    this.email = _email; // run the setter to validate
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    if (!value.includes("@") || !value.includes(".")) {
      throw new Error(`Invalid email: ${value}`);
    }
    this._email = value;
  }

  abstract getRoleDescription(): string;
}

export class Student extends Person {
  private _grades: Grade[] = [];

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    public readonly studentCardNumber: string
  ) {
    super(id, firstName, lastName, email);
  }

  public addGrade(grade: Grade): void {
    if (grade.score < 0 || grade.score > 100) {
      throw new Error("Score must be between 0 and 100");
    }
    this._grades.push(grade);
  }

  public getGrades(): readonly Grade[] {
    return this._grades;
  }

  public hasPassedCourse(courseId: string): boolean {
    return this._grades.some(
      (grade) => grade.courseId === courseId && grade.score >= PASSING_SCORE
    );
  }

  public calculateGPA(): number {
    if (this._grades.length === 0) return 0;
    const total = this._grades.reduce((acc, curr) => acc + curr.score, 0);
    return Number((total / this._grades.length).toFixed(2));
  }

  override getRoleDescription(): string {
    return `Student (card: ${this.studentCardNumber}), GPA: ${this.calculateGPA()}`;
  }
}

export abstract class Teacher extends Person {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    public readonly academicTitle: AcademicTitle,
    protected baseSalary: number
  ) {
    super(id, firstName, lastName, email);
  }

  public abstract getWorkloadCoefficient(): number;

  // Shared formula, the coefficient comes from the subclass
  public calculateSalary(): number {
    return this.baseSalary * this.getWorkloadCoefficient();
  }
}

export class Professor extends Teacher {
  constructor(id: string, firstName: string, lastName: string, email: string, baseSalary: number) {
    super(id, firstName, lastName, email, "Professor", baseSalary);
  }

  override getWorkloadCoefficient(): number {
    return 1.5;
  }

  override getRoleDescription(): string {
    return `Professor (${this.fullName})`;
  }
}

export class AssociateProfessor extends Teacher {
  constructor(id: string, firstName: string, lastName: string, email: string, baseSalary: number) {
    super(id, firstName, lastName, email, "AssociateProfessor", baseSalary);
  }

  override getWorkloadCoefficient(): number {
    return 1.25;
  }

  override getRoleDescription(): string {
    return `Associate Professor (${this.fullName})`;
  }
}
