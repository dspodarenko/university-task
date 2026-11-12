import { Student, Professor, AssociateProfessor } from "./person-hierarchy.js";
import { Staff } from "./staff.js";
import { Course } from "./learning-units.js";
import { Faculty } from "./faculty.js";
import { InMemoryRepository } from "./repository.js";
import { ReportGenerator, XmlReportGenerator, JsonReportGenerator } from "./reports.js";
import { PASSING_SCORE } from "./basic-contracts.js";

async function runDemonstration() {
  console.log("=== 1. Teachers (inheritance and polymorphism) ===");
  const profShevchenko = new Professor("t-1", "Taras", "Shevchenko", "t.shevchenko@univ.edu", 20000);
  const docentKoval = new AssociateProfessor("t-2", "Olena", "Koval", "o.koval@univ.edu", 16000);

  console.log(`${profShevchenko.getRoleDescription()} | Coefficient: ${profShevchenko.getWorkloadCoefficient()} | Salary: ${profShevchenko.calculateSalary()}`);
  console.log(`${docentKoval.getRoleDescription()} | Coefficient: ${docentKoval.getWorkloadCoefficient()} | Salary: ${docentKoval.calculateSalary()}`);

  console.log("\n=== 2. Faculty and groups (composition) ===");
  const csFaculty = new Faculty("f-1", "Faculty of Computer Science");

  const groupKN21 = csFaculty.createGroup("g-kn21", "KN-21", docentKoval);
  console.log(`Group "${groupKN21.name}" created in "${csFaculty.name}"`);

  console.log("\n=== 3. Students and grades (aggregation and encapsulation) ===");
  const studentIvan = new Student("s-101", "Ivan", "Melnyk", "ivan.m@univ.edu", "KB123456");
  const studentAnna = new Student("s-102", "Anna", "Boiko", "anna.b@univ.edu", "KB123457");

  groupKN21.addStudent(studentIvan);
  groupKN21.addStudent(studentAnna);

  const tsCourse = new Course("c-ts", "TypeScript Enterprise Patterns", 5, profShevchenko);

  studentIvan.addGrade({ courseId: tsCourse.id, score: 95, date: new Date() });
  studentIvan.addGrade({ courseId: tsCourse.id, score: 87, date: new Date() });

  studentAnna.addGrade({ courseId: tsCourse.id, score: 98, date: new Date() });
  studentAnna.addGrade({ courseId: tsCourse.id, score: 92, date: new Date() });

  console.log(`Ivan's GPA: ${studentIvan.calculateGPA()}`);
  console.log(`Anna's GPA: ${studentAnna.calculateGPA()}`);
  console.log(`Average score of group ${groupKN21.name}: ${groupKN21.getGroupAverageScore()}`);

  console.log("\n=== 4. Generic repository ===");
  const studentRepo = new InMemoryRepository<Student>();
  await studentRepo.save(studentIvan);
  await studentRepo.save(studentAnna);

  const foundStudent = await studentRepo.findById("s-101");
  console.log(`Found in repository: ${foundStudent?.fullName} (${foundStudent?.email})`);
  console.log(`Students in repository: ${(await studentRepo.findAll()).length}`);

  console.log("\n=== 5. Staff member ===");
  const adminPetrenko = new Staff("st-1", "Maria", "Petrenko", "m.petrenko@univ.edu", "Dean's Office", "Coordinator");
  console.log(adminPetrenko.getRoleDescription());
  console.log(adminPetrenko.generateServiceCard());

  // Polymorphism: each subclass describes itself differently
  console.log("\nEveryone at the university:");
  const people = [profShevchenko, docentKoval, studentIvan, adminPetrenko];
  for (const person of people) {
    console.log(` - ${person.fullName}: ${person.getRoleDescription()}`);
  }

  console.log("\n=== 6. Course prerequisites ===");
  const jsCourse = new Course("c-js", "JavaScript Basics", 4, docentKoval);
  const reactCourse = new Course("c-react", "React + TypeScript", 6, profShevchenko);

  reactCourse.addPrerequisite(jsCourse);
  reactCourse.addPrerequisite(tsCourse);
  const prerequisiteTitles = reactCourse.getPrerequisites().map((course) => course.title).join(", ");
  console.log(`Prerequisites for "${reactCourse.title}": ${prerequisiteTitles}`);
  console.log(`Passing score: ${PASSING_SCORE}`);

  studentIvan.addGrade({ courseId: jsCourse.id, score: 78, date: new Date() });
  studentAnna.addGrade({ courseId: jsCourse.id, score: 45, date: new Date() });

  console.log(`Can Ivan enroll? ${reactCourse.canEnroll(studentIvan)}`);
  console.log(`Can Anna enroll? ${reactCourse.canEnroll(studentAnna)}`);

  reactCourse.enrollStudent(studentIvan);
  console.log(`Ivan enrolled in "${reactCourse.title}"`);

  try {
    reactCourse.enrollStudent(studentAnna);
  } catch (error) {
    if (error instanceof Error) console.log(`Error: ${error.message}`);
  }

  console.log(`Enrolled students: ${reactCourse.getEnrolledStudents().map((s) => s.fullName).join(", ")}`);

  console.log("\n=== 7. Report export (template method) ===");
  // Typed as the abstract class, any subclass fits
  const xmlReport: ReportGenerator = new XmlReportGenerator(groupKN21);
  const jsonReport: ReportGenerator = new JsonReportGenerator(groupKN21);

  console.log("\n--- XML ---");
  console.log(xmlReport.generate());

  console.log("\n--- JSON ---");
  console.log(jsonReport.generate());

  console.log("\n=== 8. Repository filtering with a predicate ===");
  const studentOksana = new Student("s-103", "Oksana", "Tkachenko", "oksana.t@univ.edu", "KB123458");
  studentOksana.addGrade({ courseId: tsCourse.id, score: 70, date: new Date() });
  await studentRepo.save(studentOksana);

  const excellentStudents = await studentRepo.findWhere((student) => student.calculateGPA() >= 85);
  console.log(`Top students (GPA >= 85): ${excellentStudents.map((s) => `${s.fullName} (${s.calculateGPA()})`).join(", ")}`);

  const passedJs = await studentRepo.findWhere((student) => student.hasPassedCourse(jsCourse.id));
  console.log(`Passed "${jsCourse.title}": ${passedJs.map((s) => s.fullName).join(", ")}`);

  // Same generic repository, different entity type
  const courseRepo = new InMemoryRepository<Course>();
  await courseRepo.save(jsCourse);
  await courseRepo.save(tsCourse);
  await courseRepo.save(reactCourse);

  const bigCourses = await courseRepo.findWhere((course) => course.credits >= 5);
  console.log(`Courses with 5+ credits: ${bigCourses.map((c) => c.title).join(", ")}`);
}

runDemonstration().catch(console.error);
