/// <reference path="page.ts" />
"use strict";

namespace View 
{
	export class ArenaPage extends Page
	{
		button: HTMLButtonElement;
		selectA: HTMLSelectElement;
		selectB: HTMLSelectElement;
		event: Model.FightEvent;

		constructor(event: Model.Event)
		{
			super('Choose Fighters');

			this.event = event as Model.FightEvent;
			Util.assert(!!this.event);

			let topDiv = document.createElement('div');

			this.selectA = this.makeSelect();
			topDiv.appendChild(this.selectA);

			if (this.event.home)
			{
				this.selectB = this.makeSelect();
				if (this.selectB.options.length > 1)
					this.selectB.selectedIndex = 1;

				topDiv.appendChild(this.selectB);
			}

			this.button = document.createElement('button');
			this.button.addEventListener('click', this.onStartButton);
			topDiv.appendChild(this.button);

			this.div.appendChild(topDiv);

			this.updateStartButton();
		}

		makeSelect()
		{
			let makeOption = function (id: string)
			{
				let option = document.createElement('option');
				option.text = Model.state.team.fighters[id].name;
				if (Model.state.team.fighters[id].isDead())
					option.text += ' (x_x)';
				return option;
			};


			let select = document.createElement('select');
			select.addEventListener('change', this.onFightersChanged);
			for (let id in Model.state.team.fighters)
				select.options.add(makeOption(id));

			return select;
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
			const fighterIDs = Model.state.team.getFighterIDs();

			if (this.event.home)
				Model.state.startFight(new Model.Fight.Side(fighterIDs[this.selectA.selectedIndex], null), new Model.Fight.Side(fighterIDs[this.selectB.selectedIndex], null));
			else
				Model.state.startFight(new Model.Fight.Side(fighterIDs[this.selectA.selectedIndex], null), this.event.createNPCSide());

			Page.hideCurrent();
		}
		
		onFightersChanged = () =>
		{
			this.updateStartButton();
		}

		getFighters()
		{
			let fighterIDs = Model.state.team.getFighterIDs();
			let fighters: Model.Fighter[] = [];
			fighters.push(this.selectA.selectedIndex < 0 ? null : Model.state.team.fighters[fighterIDs[this.selectA.selectedIndex]]);

			if (this.event.home)
				fighters.push(this.selectB.selectedIndex < 0 ? null : Model.state.team.fighters[fighterIDs[this.selectB.selectedIndex]]);

			return fighters;
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

			if (this.event.home)
				this.button.disabled = !fighters[0] || !fighters[1] || fighters[0] == fighters[1] || fighters[0].isDead() || fighters[1].isDead();
			else
				this.button.disabled = !fighters[0] || fighters[0].isDead();
		}
	}
}
