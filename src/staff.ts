import { Person } from "./person-hierarchy.js";

export class Staff extends Person {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    public department: string,
    public position: string
  ) {
    super(id, firstName, lastName, email);
  }

  public generateServiceCard(): string {
    const year = new Date().getFullYear();

    return [
      "========= STAFF ID CARD =========",
      `ID:          ${this.id.toUpperCase()}-${year}`,
      `Name:        ${this.fullName}`,
      `Position:    ${this.position}`,
      `Department:  ${this.department}`,
      `Email:       ${this.email}`,
      `Valid until: 31.12.${year}`,
      "=================================",
    ].join("\n");
  }

  override getRoleDescription(): string {
    return `Staff (${this.position}, ${this.department})`;
  }
}
