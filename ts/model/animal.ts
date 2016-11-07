/// <reference path="fighter.ts" />

"use strict";

namespace Model
{
    export class Animal extends Fighter
    {
        constructor(id: number, typeID: string)
        {
            let type = Data.Animals.Types[typeID];
            super(id, typeID, FighterType.Animal, type.name, type.health);
        }
    }
}
