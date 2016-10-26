"use strict";

namespace Model
{
    export namespace Buildings
    {
        export class State
        {
            types: { [key: string]: any; } = {};
            constructor()
            {
                for (var type in Data.Buildings.Levels)
                {
                    var free = Data.Buildings.getLevel(type, 0).cost == 0;
                    this.types[type] = { levelIndex: free ? 0 : -1, progress: -1 }
                }
            }

            update(seconds: number)
            {
                let changed = false;
                for (let id in this.types)
                    if (this.continueConstruction(id, seconds))
                        changed = true;

                return changed;
            }

            getCurrentLevelIndex(id: string): number
            {
                Util.assert(id in this.types);
                return this.types[id].levelIndex;
            }

            getNextLevelIndex(id: string): number
            {
                var nextIndex = this.getCurrentLevelIndex(id) + 1;
                return nextIndex < this.getLevelCount(id) ? nextIndex : -1;
            }

            getNextUpgradeIndex(id: string): number
            {
                var index = this.getCurrentLevelIndex(id) + 1;
                if (this.isConstructing(id))
                    ++index;
                return index < this.getLevelCount(id) ? index : -1;
            }

            setLevelIndex(id: string, index: number)
            {
                Util.assert(id in this.types);
                Util.assert(index < this.getLevelCount(id));
                this.types[id].levelIndex = index;
                Model.saveState();
            }

            canUpgrade(id: string): boolean
            {
                Util.assert(id in this.types);
                var level = this.getNextLevel(id);
                return level && Model.state.money >= level.cost && !this.isConstructing(id);
            }

            buyUpgrade(id: string) 
            {
                Util.assert(this.canUpgrade(id));
                Model.state.spendMoney(this.getNextLevel(id).cost);
                this.types[id].progress = 0;
                Model.saveState();
            }

            isConstructing(id: string)
            {
                return this.types[id].progress >= 0;
            }

            continueConstruction(id: string, seconds: number) 
            {
                Util.assert(id in this.types);
                if (!this.isConstructing(id))
                    return false;

                let level = this.getNextLevel(id);
                Util.assert(level != null);

                if (this.types[id].progress + seconds >= level.buildTime)
                {
                    this.types[id].progress = -1;
                    ++this.types[id].levelIndex;
                }
                else
                    this.types[id].progress += seconds;

                return true;
            }

            getConstructionProgress(id: string): number // Normalised. 
            {
                Util.assert(id in this.types);
                let progress = this.types[id].progress;
                if (progress < 0)
                    return 0;
                let level = this.getNextLevel(id);
                Util.assert(level != null);
                return progress / level.buildTime;
            }

            private getNextLevel(id: string): Data.Buildings.Level
            {
                return Data.Buildings.getLevel(id, this.getNextLevelIndex(id));
            }

            private getLevelCount(id: string): number
            {
                return Data.Buildings.Levels[id].length;
            }
        }
    }
}
