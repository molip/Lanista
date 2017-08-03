/// <reference path="page.ts" />

namespace View 
{
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

			let page = this.addPage('People', Controller.Shop.PersonItem);
			page = this.addPage('Buildings', Controller.Shop.BuildingItem);
		}

		private addPage(name: string, itemType: typeof Controller.Shop.Item)
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

		addItem(item: Controller.Shop.Item)
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
