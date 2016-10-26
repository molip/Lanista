"use strict";

namespace Data
{
    export namespace Buildings
    {
        export class Level { constructor(public mapImage: string, public mapX: number, public mapY: number, public shopImage: string, public name: string, public description: string, public cost: number, public buildTime: number) { } }
        export let Levels: { [key: string]: Level[]; }

        export function getLevel(id: string, index: number): Level
        {
            Util.assert(id in Levels);
            return index >= 0 && index < Levels[id].length ? Levels[id][index] : null;
        }
    }

    export namespace Misc
    {
        export let TownTrigger: { mapX: number, mapY: number, mapImage: string };
        export let LudusBackgroundImage: string;
        export let ConstructionImage: string
    }
}