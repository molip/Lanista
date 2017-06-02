/// <reference path="page.ts" />
"use strict";

namespace View 
{
	export class ArenaPage extends Page
	{
		button: HTMLButtonElement;
		selectA: HTMLSelectElement;
		selectB: HTMLSelectElement;

		constructor()
		{
			super('Choose Fighters');

			let topDiv = document.createElement('div');

			this.selectA = document.createElement('select');
			this.selectB = document.createElement('select');

			this.selectA.addEventListener('change', this.onFightersChanged);
			this.selectB.addEventListener('change', this.onFightersChanged);

			let makeOption = function(id: string)
			{
				let option = document.createElement('option');
				option.text = Model.state.fighters[id].name;
				if (Model.state.fighters[id].isDead())
					option.text += ' (x_x)';
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
			this.button.addEventListener('click', this.onStartButton);

			topDiv.appendChild(this.selectA);
			topDiv.appendChild(this.selectB);
			topDiv.appendChild(this.button);

			this.div.appendChild(topDiv);

			this.updateStartButton();
		}

		onShow()
		{
		}

		onClose()
		{
			if (Model.state.fight == null)
				Model.state.advancePhase();

			return true;
		}

		onStartButton = () =>
		{
			const fighterIDs = Model.state.getFighterIDs();
			Model.state.startFight(new Model.Fight.Team(fighterIDs[this.selectA.selectedIndex]), new Model.Fight.Team(fighterIDs[this.selectA.selectedIndex]));

			Page.hideCurrent();
		}
		
		onFightersChanged = () =>
		{
			this.updateStartButton();
		}

		getFighters()
		{
			let fighterIDs = Model.state.getFighterIDs();
			let fighterA = this.selectA.selectedIndex < 0 ? null : Model.state.fighters[fighterIDs[this.selectA.selectedIndex]];
			let fighterB = this.selectB.selectedIndex < 0 ? null : Model.state.fighters[fighterIDs[this.selectB.selectedIndex]];
			return [fighterA, fighterB];
		}

		updateStartButton()
		{
			if (Model.state.fight)
			{
				this.button.innerText = 'Stop';
				this.button.disabled = false;
				return;
			}

			this.button.innerText = 'Start';
			let fighters = this.getFighters();
			this.button.disabled = !fighters[0] || !fighters[1] || fighters[0] == fighters[1] || fighters[0].isDead() || fighters[1].isDead();
		}
	}
}
