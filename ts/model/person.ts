/// <reference path="fighter.ts" />

"use strict";

namespace Model
{
    export class Person extends Fighter
    {
        constructor(id: number, typeID: string)
        {
            let type = Data.People.Types[typeID];
            super(id, typeID, FighterType.Person, type.name, type.health);
        }
    }
}
