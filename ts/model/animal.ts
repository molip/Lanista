"use strict";

namespace Model
{
    export class Animal
    {
        health: number;
        constructor(public id: string)
        {
            let type = Data.Animals.Types[id];
            this.health = type.health;
        }
    }
}
