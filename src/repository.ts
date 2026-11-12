import { Identifiable } from "./basic-contracts.js";

export interface IRepository<T extends Identifiable> {
  save(entity: T): Promise<void>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<boolean>;
  findWhere(predicate: (item: T) => boolean): Promise<T[]>;
}

export class InMemoryRepository<T extends Identifiable> implements IRepository<T> {
  private _items: Map<string, T> = new Map();

  async save(entity: T): Promise<void> {
    this._items.set(entity.id, entity);
  }

  async findById(id: string): Promise<T | null> {
    const item = this._items.get(id);
    return item ?? null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this._items.values());
  }

  async delete(id: string): Promise<boolean> {
    return this._items.delete(id);
  }

  async findWhere(predicate: (item: T) => boolean): Promise<T[]> {
    return Array.from(this._items.values()).filter(predicate);
  }
}
