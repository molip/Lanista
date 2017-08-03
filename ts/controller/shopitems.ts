namespace Controller
{
	export namespace Shop
	{
		export abstract class Item
		{
			constructor(public tag: string, public title: string, public description: string, public image: string, public cost: number) { }

			abstract canBuy(): boolean;
			abstract buy(): void;
		}

		export class BuildingItem extends Item
		{
			constructor(tag: string)
			{
				let levelIndex = Model.state.buildings.getNextUpgradeIndex(tag);
				let level = Data.Buildings.getLevel(tag, levelIndex);
				Util.assert(level != null);
				super(tag, level.name, level.description, Util.getImage('buildings', tag + levelIndex), level.cost);
			}

			canBuy()
			{
				return Model.state.buildings.canUpgrade(this.tag);
			}

			buy()
			{
				Model.state.buildings.buyUpgrade(this.tag);
			}

		}

		export class PersonItem extends Item
		{
			constructor(tag: string)
			{
				let levelIndex = Model.state.buildings.getNextUpgradeIndex(tag);
				let level = Data.Buildings.getLevel(tag, levelIndex);
				Util.assert(level != null);
				super(tag, level.name, level.description, Util.getImage('buildings', tag + levelIndex), level.cost);
			}

			canBuy()
			{
				return Model.state.buildings.canUpgrade(this.tag);
			}

			buy()
			{
				Model.state.buildings.buyUpgrade(this.tag);
			}

		}
	}
}