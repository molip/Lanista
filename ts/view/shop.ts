/// <reference path="page.ts" />

namespace View 
{
	export class ShopPage extends Page
	{
		private	tabs: TabBar;
		private scrollers: HTMLDivElement[] = [];
		private items: [Controller.Shop.Item, Table.NumberInputCell][] = [];
		private totalSpan: HTMLSpanElement;
		private checkoutButton: HTMLButtonElement;

		constructor(title: string)
		{
			super(title);
			
			let topDiv = document.createElement('div');
			let bottomDiv = document.createElement('div');

			topDiv.id = 'shop_top';
			bottomDiv.id = 'shop_bottom';

			this.tabs = new TabBar((data: any) => { this.onTabClicked(data); });
			topDiv.appendChild(this.tabs.div);

			this.div.appendChild(topDiv);
			this.div.appendChild(bottomDiv);

			this.totalSpan = document.createElement('span');
			this.checkoutButton = document.createElement('button');
			this.checkoutButton.innerText = 'Check out';
			this.checkoutButton.addEventListener('click', () => { this.onCheckOut(); });

			this.totalSpan.style.cssFloat = this.checkoutButton.style.cssFloat = 'right';

			bottomDiv.appendChild(this.checkoutButton);
			bottomDiv.appendChild(this.totalSpan);
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

		onShow()
		{
			this.updateItems();
		}

		private onTabClicked(data: any)
		{
			for (let scroller of this.scrollers)
				scroller.hidden = scroller !== data;
		}

		private onCheckOut()
		{
			for (let [item, cell] of this.items)
				for (let i = 0; i < cell.value; ++i)
					item.buy();

			Page.hideCurrent();
			Controller.updateHUD();
			View.ludus.updateObjects();
		}

		private updateItems()
		{
			let total = 0;
			let basket = new NumberMap();

			for (let [item, cell] of this.items)
			{
				total += item.cost * cell.value;
				basket.add(item.type, cell.value);
			}

			let moneyLeft = Model.state.getMoney() - total;

			for (let [item, cell] of this.items)
			{
				let canAdd = item.canBuy() && item.canAddToBasket(basket) && item.cost <= moneyLeft;

				cell.decButton.disabled = cell.value == 0;
				cell.incButton.disabled = !canAdd;
			}

			this.totalSpan.innerText = 'Total: ' + total + '. Money left: ' + moneyLeft;
			this.totalSpan.style.marginRight = '1em';
			this.checkoutButton.disabled = total == 0;
		}

		addItem(item: Controller.Shop.Item, table: Table.Factory)
		{
			let inputCell = new Table.NumberInputCell(15, () => { this.updateItems(); });
			let cells =
				[
					new Table.TextCell('<h4>' + item.title + '</h4>', 15),
					new Table.ImageCell(item.image, 15),
					new Table.TextCell(item.description, 40),
					new Table.TextCell(Util.formatMoney(item.cost), 15),
					inputCell
				];

			table.addRow(cells, !item.canBuy(), null);

			this.items.push([item, inputCell]);
		}
	}
}
