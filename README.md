# University Management System — OOP in TypeScript

A small domain model of a university built with object-oriented TypeScript: classes, access modifiers, abstract classes, interfaces, generics, and the relationships between objects (inheritance, composition, aggregation).

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
```

```bash
npm start
```

Type check only, without running:

```bash
npm run check
```

## Project structure

```
src/
├── basic-contracts.ts   — Identifiable, Grade, AcademicTitle, PASSING_SCORE
├── person-hierarchy.ts  — Person (abstract) → Student, Teacher (abstract) → Professor, AssociateProfessor
├── staff.ts             — Staff (administrative employee)
├── learning-units.ts    — Course (with prerequisites), AcademicGroup
├── faculty.ts           — Faculty (owns its groups)
├── reports.ts           — ReportGenerator, XmlReportGenerator, JsonReportGenerator
├── repository.ts        — IRepository<T>, InMemoryRepository<T>
└── main.ts              — demo of everything above
```

`tsconfig.json` uses `strict`, `noImplicitOverride` (that is why every overridden method is marked `override`) and `moduleResolution: NodeNext` (that is why imports end with `.js` even though the files are `.ts`).

## Features

### People
- `Person` is an abstract base class with an `id`, a full name and an email validated by a setter.
- `Student` keeps private grades, calculates GPA and checks whether a course is passed (`score >= 60`).
- `Teacher` is abstract: the salary formula is shared (`baseSalary × coefficient`), while each subclass provides its own workload coefficient — `Professor` 1.5, `AssociateProfessor` 1.25.
- `Staff` is an administrative employee with a department and position, and can generate a staff ID card.

### Courses and groups
- `Course` aggregates its instructor, a list of prerequisite courses and enrolled students.
  - `addPrerequisite` adds a prerequisite, rejecting the course itself and duplicates.
  - `getMissingPrerequisites` lists courses a student has not passed yet.
  - `canEnroll` / `enrollStudent` allow enrollment only when all prerequisites are passed.
- `AcademicGroup` aggregates students and an optional curator, and calculates the group's average score.
- `Faculty` creates and removes its own groups (`createGroup`, `removeGroup`).

### Reports
`ReportGenerator` is an abstract class implementing the **template method** pattern: `generate()` always runs `generateHeader()` → `generateBody()` → `generateFooter()`, and the subclasses decide what each step looks like.
- `XmlReportGenerator` escapes `& < > "` so the output stays valid XML.
- `JsonReportGenerator` uses `JSON.stringify` for values so the output stays valid JSON.

### Repository
`InMemoryRepository<T extends Identifiable>` is a generic store backed by a `Map` with `save`, `findById`, `findAll`, `delete` and `findWhere(predicate)`. The same class works for any entity with an `id`, e.g. `InMemoryRepository<Student>` and `InMemoryRepository<Course>`.

## Relationships

| Relationship | Where |
| --- | --- |
| Inheritance | `Person` ← `Student`, `Teacher`, `Staff`; `Teacher` ← `Professor`, `AssociateProfessor`; `ReportGenerator` ← `XmlReportGenerator`, `JsonReportGenerator` |
| Composition | `Faculty` creates and owns its groups |
| Aggregation | `AcademicGroup` → `Student`; `Course` → `Teacher`, prerequisite `Course`s, enrolled `Student`s |
| Association | `Student` → `Grade` |
| Interface implementation | `InMemoryRepository<T>` implements `IRepository<T>`; entities implement `Identifiable` |
