import { AcademicGroup } from "./learning-units.js";

export abstract class ReportGenerator {
  constructor(protected readonly group: AcademicGroup) {}

  // Template method: fixed order of steps, subclasses fill in the details
  public generate(): string {
    return [this.generateHeader(), this.generateBody(), this.generateFooter()].join("\n");
  }

  protected abstract generateHeader(): string;
  protected abstract generateBody(): string;
  protected abstract generateFooter(): string;

  protected getCuratorName(): string {
    return this.group.curator ? this.group.curator.fullName : "not assigned";
  }
}

export class XmlReportGenerator extends ReportGenerator {
  protected override generateHeader(): string {
    return [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<groupReport>`,
      `  <group>${this.escapeXml(this.group.name)}</group>`,
      `  <curator>${this.escapeXml(this.getCuratorName())}</curator>`,
    ].join("\n");
  }

  protected override generateBody(): string {
    const lines: string[] = ["  <students>"];

    for (const student of this.group.getStudents()) {
      lines.push(`    <student id="${this.escapeXml(student.id)}">`);
      lines.push(`      <name>${this.escapeXml(student.fullName)}</name>`);
      lines.push(`      <gpa>${student.calculateGPA()}</gpa>`);
      lines.push(`    </student>`);
    }

    lines.push("  </students>");
    return lines.join("\n");
  }

  protected override generateFooter(): string {
    return [
      `  <averageScore>${this.group.getGroupAverageScore()}</averageScore>`,
      `</groupReport>`,
    ].join("\n");
  }

  private escapeXml(text: string): string {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }
}

export class JsonReportGenerator extends ReportGenerator {
  // JSON.stringify escapes quotes, so the output stays valid JSON
  protected override generateHeader(): string {
    return [
      `{`,
      `  "group": ${JSON.stringify(this.group.name)},`,
      `  "curator": ${JSON.stringify(this.getCuratorName())},`,
    ].join("\n");
  }

  protected override generateBody(): string {
    const studentLines = this.group.getStudents().map((student) => {
      const item = { id: student.id, name: student.fullName, gpa: student.calculateGPA() };
      return `    ${JSON.stringify(item)}`;
    });

    return [`  "students": [`, studentLines.join(",\n"), `  ],`].join("\n");
  }

  protected override generateFooter(): string {
    return [`  "averageScore": ${this.group.getGroupAverageScore()}`, `}`].join("\n");
  }
}
