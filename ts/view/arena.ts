/// <reference path="page.ts" />
"use strict";

namespace View 
{
	export class ArenaPage extends Page
	{
		para: HTMLParagraphElement;
		scroller: HTMLDivElement;
		button: HTMLButtonElement;
		selectA: HTMLSelectElement;
		selectB: HTMLSelectElement;
		ticks: number;

		constructor()
		{
			super('Arena');

			this.ticks = 0;

			let topDiv = document.createElement('div');
			topDiv.style.top = '0%';
			topDiv.style.bottom = '95%';
			topDiv.style.position = 'absolute';

			this.selectA = document.createElement('select');
			this.selectB = document.createElement('select');

			this.selectA.addEventListener('change', this.updateStartButton);
			this.selectB.addEventListener('change', this.updateStartButton);

			let makeOption = function(id: string)
			{
				let option = document.createElement('option');
				option.text = Model.state.fighters[id].name;
				return option;
			};

			for (let id in Model.state.fighters)
			{
				this.selectB.options.add(makeOption(id));
				this.selectA.options.add(makeOption(id));
			}

			if (this.selectB.options.length > 1)
				this.selectB.selectedIndex = 1;

			this.button = document.createElement('button');
			this.button.innerText = 'Start';
			this.button.addEventListener('click', this.onStartButton);

			topDiv.appendChild(this.selectA);
			topDiv.appendChild(this.selectB);
			topDiv.appendChild(this.button);

			this.para = document.createElement('p');
			this.para.style.margin = '0';
			
			this.scroller = document.createElement('div');
			this.scroller.className = 'scroller';
			this.scroller.style.top = '5%';
			this.scroller.appendChild(this.para);

			this.div.appendChild(topDiv);
			this.div.appendChild(this.scroller);

			this.update();
			this.updateStartButton();
		}

		onClose()
		{
			return Model.state.fight == null;
		}

		onStartButton = () =>
		{
			let teams: Model.Fight.Team[] = [];

			let fighterIDs = Model.state.getFighterIDs();

			teams.push([fighterIDs[this.selectA.selectedIndex]]);
			teams.push([fighterIDs[this.selectB.selectedIndex]]);

			Model.state.startFight(teams[0], teams[1]);

			this.button.disabled = this.selectA.disabled = this.selectB.disabled = true;
		}

		onTick()
		{
			++this.ticks;

			if (this.ticks % 1 == 0)
			{
				if (Model.state.fight)
				{
					let finished = Model.state.fight.step();
					this.update();

					if (finished)
						Model.state.endFight();
				}
			}
		}

		updateStartButton = () =>
		{
			let a = this.selectA.selectedIndex;
			let b = this.selectB.selectedIndex;
			this.button.disabled = !!Model.state.fight || a < 0 || b < 0 || a == b;
		}

		update()
		{
			if (!Model.state.fight)
				return;

			let atEnd = Math.abs(this.scroller.scrollTop + this.scroller.clientHeight - this.scroller.scrollHeight) <= 10;

			this.para.innerHTML = Model.state.fight.text;

			if (atEnd)
				this.scroller.scrollTop = this.scroller.scrollHeight;
		}
	}
}
