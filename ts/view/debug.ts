/// <reference path="page.ts" />
"use strict";

namespace View 
{
	export class DebugPage extends Page
	{
		constructor()
		{
			super('Debug');

			this.addButton('Buy all animals', this.onBuyAll);
			this.addButton('Heal fighters', this.onHeal);
		}

		private addButton(caption: string, handler: () => void)
		{
			let button = document.createElement('button');
			button.innerText = caption;
			button.addEventListener('click', handler);
			this.div.appendChild(button);
		}

		onBuyAll = () =>
		{
			for (let tag in Data.Animals.Types)
			{
				Model.state.addMoney(Data.Animals.Types[tag].cost);
				Model.state.buyAnimal(tag);
			}
			Page.hideCurrent();
		}

		onHeal = () =>
		{
			for (let id in Model.state.fighters)
				Model.state.fighters[id].resetHealth();

			Page.hideCurrent();
		}
	}
}
