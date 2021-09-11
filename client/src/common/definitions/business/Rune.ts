import { IItem } from "../union/IItem";
import { IRuneDefinition } from "./IRuneDefinition";

export class Rune implements IItem {
  private _item: IItem;

  public name: string;
  public number: number;
  public clevel: number;

  public get wasFound(): number {
    return this._item.wasFound;
  }

  public set wasFound(value: number) {
    this._item.wasFound = value;
  }

  public get note(): string {
    return this._item.note;
  }

  public set note(value: string) {
    this._item.note = value;
  }

  public get isPerfect(): boolean {
    return this._item.isPerfect;
  }

  public set isPerfect(value: boolean) {
    this._item.isPerfect = value;
  }

  public constructor(runeDefinition: IRuneDefinition, item: IItem) {
    this.name = runeDefinition.name;
    this.number = runeDefinition.number;
    this.clevel = runeDefinition.clevel;

    this._item = item;
  }
}
