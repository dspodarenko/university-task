import { Identifiable } from "./basic-contracts.js";
import { AcademicGroup } from "./learning-units.js";
import { Teacher } from "./person-hierarchy.js";

export class Faculty implements Identifiable {
  private _groups: Map<string, AcademicGroup> = new Map();

  constructor(
    public readonly id: string,
    public name: string
  ) {}

  // Composition: the faculty creates its own groups
  public createGroup(id: string, name: string, curator?: Teacher): AcademicGroup {
    if (this._groups.has(id)) {
      throw new Error(`Group with ID ${id} already exists in ${this.name}`);
    }
    const newGroup = new AcademicGroup(id, name, curator);
    this._groups.set(id, newGroup);
    return newGroup;
  }

  public removeGroup(groupId: string): boolean {
    return this._groups.delete(groupId);
  }

  public findGroupById(groupId: string): AcademicGroup | undefined {
    return this._groups.get(groupId);
  }

  public getAllGroups(): AcademicGroup[] {
    return Array.from(this._groups.values());
  }
}
