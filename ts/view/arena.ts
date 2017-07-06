/// <reference path="page.ts" />

namespace View 
{
	class FighterUI
	{
		div: HTMLDivElement;
		select: HTMLSelectElement;
		loadout: Model.Loadout = null;
		itemIDs: string[] = [];
		checkboxCells: Table.CheckboxCell[] = [];
		other: FighterUI = null;

		constructor(index: number, arenaPage: ArenaPage)
		{
			this.div = document.createElement('div');
			this.div.id = 'fighter_ui_div';

			// Fighter select.

			let makeOption = function (id: string)
			{
				let option = document.createElement('option');
				option.text = Model.state.team.fighters[id].name;
				if (Model.state.team.fighters[id].isDead())
					option.text += ' (x_x)';
				return option;
			};

			this.select = document.createElement('select');
			this.select.addEventListener('change', () => { arenaPage.onFighterSelected(index); });
			for (let id in Model.state.team.fighters)
				this.select.options.add(makeOption(id));

			this.div.appendChild(this.select);

			// Item table.

			let tableFactory = new Table.Factory();

			tableFactory.addColumnHeader('Item');
			tableFactory.addColumnHeader('Equip');

			for (let id in Model.state.team.items)
			{
				let item = Model.state.team.items[id];
				let handler = (value: boolean) => { arenaPage.onItemChecked(index, id, value); }
				let checkboxCell = new Table.CheckboxCell(handler);
				let cells = [new Table.TextCell(Model.state.team.getItemData(id).name), checkboxCell];
				tableFactory.addRow(cells, false, null);

				this.itemIDs.push(id);
				this.checkboxCells.push(checkboxCell);
			}

			this.div.appendChild(tableFactory.element);
		}

		private getOtherLoadout()
		{
			return this.other ? this.other.loadout : null;
		}

		getFighterID()
		{
			return this.select.selectedIndex < 0 ? null : Model.state.team.getFighterIDs()[this.select.selectedIndex];
		}

		getFighter()
		{
			let id = this.getFighterID();
			return id ? Model.state.team.fighters[id] : null;
		}

		updateFighter()
		{
			if (this.select.selectedIndex < 0)
			{
				this.loadout = null;
				return;
			}

			let fighterID = Model.state.team.getFighterIDs()[this.select.selectedIndex];

			let otherLoadout = this.getOtherLoadout();
			if (otherLoadout && otherLoadout.fighterID == fighterID)
				this.loadout = otherLoadout;
			else
				this.loadout = new Model.Loadout(fighterID);
		}

		equipItem(itemID: string, value: boolean)
		{
			if (value)
				this.loadout.addItem(itemID, Model.state.team);
			else
				this.loadout.removeItem(itemID);
		}

		updateItems()
		{
			for (let i = 0; i < this.checkboxCells.length; ++i)
			{
				let checkbox = this.checkboxCells[i].checkbox;
				let itemID = this.itemIDs[i];
				let otherLoadout = this.getOtherLoadout();

				checkbox.checked = this.loadout && this.loadout.hasItemID(itemID);
				checkbox.disabled = !this.loadout || (!checkbox.checked && ((otherLoadout && otherLoadout.hasItemID(itemID)) || !this.loadout.canAddItem(itemID, Model.state.team)));
			}
		}
	}

	export class ArenaPage extends Page
	{
		button: HTMLButtonElement;
		fighterUIs: FighterUI[] = [];

		event: Model.FightEvent;

		constructor(event: Model.Event)
		{
			super('Choose Fighters');

			this.event = event as Model.FightEvent;
			Util.assert(!!this.event);

			this.addFighterUI();

			if (this.event.home)
				this.addFighterUI();

			this.button = document.createElement('button');
			this.button.addEventListener('click', this.onStartButton);
			this.div.appendChild(this.button);

			this.updateStartButton();
		}

		addFighterUI()
		{
			let index = this.fighterUIs.length;
			let fighterUI = new FighterUI(index, this);
			this.fighterUIs.push(fighterUI);
			this.div.appendChild(fighterUI.div);

			if (index == 1)
			{
				if (fighterUI.select.options.length > 1)
					fighterUI.select.selectedIndex = 1;

				this.fighterUIs[0].other = fighterUI;
				fighterUI.other = this.fighterUIs[0];
			}

			fighterUI.updateFighter();
			fighterUI.updateItems();
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
			let sideA = new Model.Fight.Side(this.fighterUIs[0].loadout, null);
			let sideB = this.event.home ? new Model.Fight.Side(this.fighterUIs[1].loadout, null) : this.event.createNPCSide();

			Model.state.startFight(sideA, sideB);

			Page.hideCurrent();
		}
		
		onFighterSelected = (fighterIndex: number) =>
		{
			this.fighterUIs[fighterIndex].updateFighter();
			this.updateStartButton();
			this.updateItems();
		}

		onItemChecked = (fighterIndex: number, itemID: string, value: boolean) =>
		{
			this.fighterUIs[fighterIndex].equipItem(itemID, value);
			this.updateItems();
		}

		updateItems()
		{
			for (let ui of this.fighterUIs)
				ui.updateItems();
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
			let fighterA = this.fighterUIs[0].getFighter();

			this.button.disabled = !fighterA || fighterA.isDead();

			if (!this.button.disabled && this.event.home)
			{
				let fighterB = this.fighterUIs[1].getFighter();
				this.button.disabled = !fighterB || fighterB.isDead() || fighterA === fighterB;
			}
		}
	}
}
