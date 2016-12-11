/// <reference path="popup.ts" />
"use strict";

namespace View 
{
	export class ArenaPopup extends Popup
	{
		para: HTMLParagraphElement;
		scroller: HTMLDivElement;
		button: HTMLButtonElement;
		ticks: number;

		constructor()
		{
			super('Arena');

			this.ticks = 0;

			this.para = document.createElement('p');
			this.para.style.margin = '0';
			
			this.scroller = document.createElement('div');
			this.scroller.className = 'scroller';
			this.scroller.style.bottom = '5%';
			this.scroller.appendChild(this.para);

			this.button = document.createElement('button');
			this.button.innerText = 'Start';
			this.button.style.top = '95%';
			this.button.style.bottom = '0';
			this.button.style.position = 'absolute';
			this.button.addEventListener('click', this.onStartButton);

			this.div.appendChild(this.scroller);
			this.div.appendChild(this.button);

			this.update();
		}

		onClose()
		{
			return Model.state.fight == null;
		}

		onStartButton()
		{
			let teams: Model.Fight.Team[] = [];
			for (let id in Model.state.fighters)
			{
				let team: Model.Fight.Team = [];
				team.push(id);
				teams.push(team);
				if (teams.length == 2)
					break;
			}

			if (teams.length == 2)
				Model.state.startFight(teams[0], teams[1]);
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
