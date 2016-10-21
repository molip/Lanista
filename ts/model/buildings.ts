"use strict";

namespace Model
{
    export namespace Buildings
    {
        class Level { constructor(public cost, public buildSteps) { } }

        export let Types = //	cost	build steps
            {
                'home': [
                    new Level(  0,      3),
                    new Level(  50,     5),
                ],
                'barracks': [
                    new Level(  100,    3),
                    new Level(  200,    5),
                ],
                'kennels': [
                    new Level(  100,    3),
                    new Level(  200,    5),
                ],
                'storage': [
                    new Level(  100,    3),
                    new Level(  200,    5),
                ],
                'weapon': [
                    new Level(  100,    3),
                    new Level(  200,    5),
                ],
                'armour': [
                    new Level(  100,    3),
                    new Level(  200,    5),
                ],
                'training': [
                    new Level(  100,    3),
                    new Level(  200,    5),
                ],
                'surgery': [
                    new Level(  100,    3),
                    new Level(  200,    5),
                ],
                'lab': [
                    new Level(  100,    3),
                    new Level(  200,    5),
                ],
                'merch': [
                    new Level(  100,    3),
                    new Level(  200,    5),
                ],
            }

        export class State
        {
            types = {};
            constructor()
            {
                for (var type in Types)
                {
                    var free = Types[type][0].cost == 0;
                    this.types[type] = { levelIndex: free ? 0 : -1, progress: -1 }
                }
            }

            getCurrentLevelIndex(id)
            {
                Util.assert(id in this.types);
                return this.types[id].levelIndex;
            }

            getNextLevelIndex(id)
            {
                var nextIndex = this.getCurrentLevelIndex(id) + 1;
                return nextIndex < Types[id].length ? nextIndex : -1;
            }

            getCurrentLevel(id)
            {
                var index = this.getCurrentLevelIndex(id);
                return index < 0 ? null : Types[id][index];
            }

            getNextLevel(id)
            {
                var index = this.getNextLevelIndex(id);
                return index < 0 ? null : Types[id][index];
            }

            setLevelIndex(id, index)
            {
                Util.assert(id in this.types);
                Util.assert(index < Types[id].length);
                this.types[id].levelIndex = index;
                Model.saveState();
            }

            canUpgrade(id)
            {
                Util.assert(id in this.types);
                var level = this.getNextLevel(id);
                return level && Model.state.money >= level.cost && this.getRemainingBuildSteps(id) == 0;
            }

            getRemainingBuildSteps(id)
            {
                Util.assert(id in this.types);
                if (this.types[id].progress < 0)
                    return 0;

                return Types[id].buildSteps - this.types[id].progress;
            }
        }
    }
}
