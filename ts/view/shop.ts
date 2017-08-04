/// <reference path="page.ts" />

namespace View 
{
	export class ShopPage extends Page
	{
		private	tabs: TabBar;
		private scrollers: HTMLDivElement[] = [];

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
		}

		addTable(name: string)
		{
			let table = new Table.Factory();
			let scroller = table.makeScroller();
			scroller.id = 'shop_scroller';
			scroller.hidden = this.scrollers.length > 0;
			this.div.appendChild(scroller);
			this.tabs.addTab(name, scroller);
			this.scrollers.push(scroller);
			return table;
		}

		private onTabClicked = (data: any) =>
		{
			for (let scroller of this.scrollers)
				scroller.hidden = scroller !== data;
		}

		addItem(item: Controller.Shop.Item, table: Table.Factory)
		{
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
