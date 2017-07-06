namespace Model
{
	export namespace Buildings
	{
		export class State
		{
			types: { [key: string]: any; } = {};
			constructor()
			{
				for (var tag in Data.Buildings.Levels)
				{
					var free = Data.Buildings.getLevel(tag, 0).cost == 0;
					this.types[tag] = { levelIndex: free ? 0 : -1, progress: -1 }
				}
			}

			update(hours: number)
			{
				let changed = false;

				let buildingCount = 0;
				for (let tag in this.types)
					if (this.isConstructing(tag))
						++buildingCount;

				for (let tag in this.types)
					if (this.continueConstruction(tag, hours / buildingCount))
						changed = true;

				return changed;
			}

			getCapacity(tag: string): number
			{
				let level = this.getCurrentLevel(tag);
				return level ? level.capacity : 0;
			}

			getCurrentLevelIndex(tag: string): number
			{
				Util.assert(tag in this.types);
				return this.types[tag].levelIndex;
			}

			getNextLevelIndex(tag: string): number
			{
				var nextIndex = this.getCurrentLevelIndex(tag) + 1;
				return nextIndex < this.getLevelCount(tag) ? nextIndex : -1;
			}

			getNextUpgradeIndex(tag: string): number
			{
				var index = this.getCurrentLevelIndex(tag) + 1;
				if (this.isConstructing(tag))
					++index;
				return index < this.getLevelCount(tag) ? index : -1;
			}

			setLevelIndex(tag: string, index: number)
			{
				Util.assert(tag in this.types);
				Util.assert(index < this.getLevelCount(tag));
				this.types[tag].levelIndex = index;
				Model.invalidate();
			}

			canUpgrade(tag: string): boolean
			{
				Util.assert(tag in this.types);
				var level = this.getNextLevel(tag);
				return level && Model.state.getMoney() >= level.cost && !this.isConstructing(tag);
			}

			buyUpgrade(tag: string) 
			{
				Util.assert(this.canUpgrade(tag));
				Model.state.spendMoney(this.getNextLevel(tag).cost);
				this.types[tag].progress = 0;
				Model.invalidate();
			}

			isConstructing(tag: string)
			{
				return this.types[tag].progress >= 0;
			}

			continueConstruction(tag: string, manHours: number) 
			{
				Util.assert(tag in this.types);
				if (!this.isConstructing(tag))
					return false;

				let level = this.getNextLevel(tag);
				Util.assert(level != null);

				if (this.types[tag].progress + manHours >= level.buildTime)
				{
					this.types[tag].progress = -1;
					++this.types[tag].levelIndex;
				}
				else
					this.types[tag].progress += manHours;

				Model.invalidate();

				return true;
			}

			getConstructionProgress(tag: string): number // Normalised. 
			{
				Util.assert(tag in this.types);
				let progress = this.types[tag].progress;
				if (progress < 0)
					return 0;
				let level = this.getNextLevel(tag);
				Util.assert(level != null);
				return progress / level.buildTime;
			}

			private getCurrentLevel(tag: string): Data.Buildings.Level
			{
				return Data.Buildings.getLevel(tag, this.getCurrentLevelIndex(tag));
			}

			private getNextLevel(tag: string): Data.Buildings.Level
			{
				return Data.Buildings.getLevel(tag, this.getNextLevelIndex(tag));
			}

			private getLevelCount(tag: string): number
			{
				return Data.Buildings.Levels[tag].length;
			}
		}
	}
}
