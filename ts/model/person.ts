"use strict";

namespace Model
{
    export class Person
    {
        health: number;
        constructor(public id: string)
        {
            let type = Data.People.Types[id];
            this.health = type.health;
        }
    }
}
