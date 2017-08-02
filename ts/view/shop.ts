/// <reference path="page.ts" />

namespace View 
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

	class TabBar
	{
		div = document.createElement('div');
		tabs: HTMLDivElement[] = [];

		constructor(private handler: (data: any) => void)
		{
			this.div.className = 'tab_bar';
		}

		private onTabClicked(tab: HTMLDivElement, data: any)
		{
			for (let t of this.tabs)
			{
				if (t === tab)
					t.classList.add('tab_selected');
				else
					t.classList.remove('tab_selected');
			}

			this.handler(data);
		}

		addTab(name: string, data?: any)
		{
			let tab = document.createElement('div');
			tab.innerText = name;
			tab.className = 'tab';
			tab.addEventListener('click', () => { this.onTabClicked(tab, data); });
			this.tabs.push(tab);
			this.div.appendChild(tab);

			if (this.tabs.length == 1)
				this.onTabClicked(tab, data);
		}
	}

	export class ShopPage extends Page
	{
		private	tabs: TabBar;
		private pages: { [itemType: string]: Table.Factory } = {};

		constructor(title: string)
		{
			super(title);
			
			let topDiv = document.createElement('div');
			let bottomDiv = document.createElement('div');

			topDiv.id = 'shop_top';
			bottomDiv.id = 'shop_bottom';

			this.tabs = new TabBar(this.onTabClicked);
			topDiv.appendChild(this.tabs.div);

			this.div.appendChild(topDiv);
			this.div.appendChild(bottomDiv);

			let page = this.addPage('People', Shop.PersonItem);
			page = this.addPage('Buildings', Shop.BuildingItem);
		}

		private addPage(name: string, itemType: typeof Shop.Item)
		{
			let table = new Table.Factory();
			let scroller = table.makeScroller();
			scroller.id = 'shop_scroller';
			scroller.hidden = true;
			this.div.appendChild(scroller);
			this.tabs.addTab(name, scroller);
			this.pages[itemType.name] = table;
		}

		private onTabClicked = (data: any) =>
		{
			for (let type in this.pages)
			{
				let scroller = this.pages[type].scroller;
				scroller.hidden = scroller !== data;
			}
		}

		addItem(item: Shop.Item)
		{
			let table = this.pages[item.constructor.name];
			Util.assert(table != null);

			let cells = [new Table.TextCell('<h4>' + item.title + '</h4>', 20), new Table.ImageCell(item.image, 20), new Table.TextCell(item.description), new Table.TextCell(Util.formatMoney(item.cost))];
			table.addRow(cells, !item.canBuy(), function ()
			{
				Page.hideCurrent();
				item.buy();
				Controller.updateHUD();
				View.ludus.updateObjects();
			});
		}
	}
}
