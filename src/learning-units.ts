import { Identifiable } from "./basic-contracts.js";
import { Student, Teacher } from "./person-hierarchy.js";

export class Course implements Identifiable {
  // Aggregation: these objects live on their own, we only keep references
  private _prerequisites: Course[] = [];
  private _enrolledStudents: Map<string, Student> = new Map();

  constructor(
    public readonly id: string,
    public title: string,
    public credits: number,
    private _instructor: Teacher
  ) {}

  get instructor(): Teacher {
    return this._instructor;
  }

  public reassignInstructor(newInstructor: Teacher): void {
    console.log(`[Course Info] New instructor for "${this.title}": ${newInstructor.fullName}`);
    this._instructor = newInstructor;
  }

  public addPrerequisite(course: Course): void {
    if (course.id === this.id) {
      throw new Error(`Course "${this.title}" cannot be a prerequisite of itself`);
    }
    if (this._prerequisites.includes(course)) {
      throw new Error(`Course "${course.title}" is already a prerequisite of "${this.title}"`);
    }
    this._prerequisites.push(course);
  }

  public getPrerequisites(): readonly Course[] {
    return this._prerequisites;
  }

  public getMissingPrerequisites(student: Student): Course[] {
    return this._prerequisites.filter((course) => !student.hasPassedCourse(course.id));
  }

  public canEnroll(student: Student): boolean {
    return this.getMissingPrerequisites(student).length === 0;
  }

  public enrollStudent(student: Student): void {
    if (this._enrolledStudents.has(student.id)) {
      throw new Error(`${student.fullName} is already enrolled in "${this.title}"`);
    }

    const missing = this.getMissingPrerequisites(student);
    if (missing.length > 0) {
      const titles = missing.map((course) => course.title).join(", ");
      throw new Error(
        `${student.fullName} cannot enroll in "${this.title}". Missing courses: ${titles}`
      );
    }

    this._enrolledStudents.set(student.id, student);
  }

  public getEnrolledStudents(): Student[] {
    return Array.from(this._enrolledStudents.values());
  }
}

export class AcademicGroup implements Identifiable {
  private _students: Map<string, Student> = new Map();

  constructor(
    public readonly id: string,
    public name: string,
    public curator?: Teacher
  ) {}

  public addStudent(student: Student): void {
    if (this._students.has(student.id)) {
      throw new Error(`${student.fullName} is already in group ${this.name}`);
    }
    this._students.set(student.id, student);
  }

  public removeStudent(studentId: string): boolean {
    return this._students.delete(studentId);
  }

  public getStudents(): Student[] {
    return Array.from(this._students.values());
  }

  public getGroupAverageScore(): number {
    const list = this.getStudents();
    if (list.length === 0) return 0;
    const totalGpa = list.reduce((acc, s) => acc + s.calculateGPA(), 0);
    return Number((totalGpa / list.length).toFixed(2));
  }
}
