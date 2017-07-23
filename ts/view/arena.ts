
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
		fameCells: Table.TextCell[] = [];
		fighterFameCell: Table.TextCell;
		totalFameCell: Table.TextCell;
		totalFame = 0;
		other: FighterUI = null;

		constructor(public index: number, arenaPage: ArenaPage)
		{
			this.div = document.createElement('div');
			this.div.id = 'fighter_ui_div';

			// Fighter select.

			let makeOption = function (id: string)
			{
				let option = document.createElement('option');
				option.text = Model.state.team.fighters[id].name;
				if (!Model.state.team.fighters[id].canFight(arenaPage.event.injuryThreshold))
					option.text += ' (x_x)';
				return option;
			};

			let items: Table.SelectCellItem[] = [];

			for (let id in Model.state.team.fighters)
			{
				let fighter = Model.state.team.fighters[id];
				let name = fighter.name;
				if (!fighter.canFight(arenaPage.event.injuryThreshold))
					name += ' (x_x)';

				items.push(new Table.SelectCellItem(id, name));
			}

			let tableFactory = new Table.Factory();

			tableFactory.addColumnHeader('Fighter ' + (index + 1));
			tableFactory.addColumnHeader('Fame');
			tableFactory.addColumnHeader('Equip');

			// Fighter row.
			let selectCell = new Table.SelectCell(0, items, (value: string) => { arenaPage.onFighterSelected(index); });
			this.fighterFameCell = new Table.TextCell('');
			tableFactory.addRow([selectCell, this.fighterFameCell, null], false, null);
			this.select = selectCell.selectElement;
			this.select.selectedIndex = 0;

			// Item rows.
			for (let id in Model.state.team.items)
			{
				let item = Model.state.team.items[id];
				let data = Model.state.team.getItemData(id);
				let handler = (value: boolean) => { arenaPage.onItemChecked(index, id, value); }
				let checkboxCell = new Table.CheckboxCell(handler);
				let fameCell = new Table.TextCell(data.fame.toString());
				let cells = [new Table.TextCell(data.name), fameCell, checkboxCell];
				tableFactory.addRow(cells, false, null);

				this.itemIDs.push(id);
				this.checkboxCells.push(checkboxCell);
				this.fameCells.push(fameCell);
			}

			// Total row.
			this.totalFameCell = new Table.TextCell('');
			let cells = [new Table.TextCell('Total'), this.totalFameCell, null];
			let row = tableFactory.addRow(cells, false, null);
			row.style.fontWeight = 'bold';

			this.div.appendChild(tableFactory.makeScroller());
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

		makeSide()
		{
			return this.getFighter() ? new Model.Fight.Side(this.loadout, null) : null;
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

			this.fighterFameCell.cellElement.innerText = this.getFighter().fame.toString();

			this.updateItems();
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
				this.fameCells[i].cellElement.style.color = checkbox.checked ? 'black' : 'grey';
			}

			this.totalFame = this.getFighter().fame + this.makeSide().getEquipmentFame();
			this.totalFameCell.cellElement.innerText = this.totalFame.toString();
		}
	}

	export class ArenaPage extends Page
	{
		button: HTMLButtonElement;
		fighterUIs: FighterUI[] = [];
		statsTable: HTMLTableElement;
		rewardsTable: HTMLTableElement;

		event: Model.FightEvent;
		fameOK = true;
		fight: Model.Fight.State = null;

		constructor(event: Model.Event)
		{
			super('Choose Fighters');

			this.event = Util.assertCast(event, Model.FightEvent);

			this.addFighterUI();

			if (this.getHomeFightEvent())
				this.addFighterUI();

			let statsDiv = document.createElement('div');
			statsDiv.id = 'arena_stats_div';
			this.div.appendChild(statsDiv);

			const home = this.getHomeFightEvent() != null;

			this.statsTable = document.createElement('table');
			this.statsTable.id = 'arena_stats_table';
			statsDiv.appendChild(this.statsTable);

			let hr = document.createElement('hr');
			statsDiv.appendChild(hr);

			let rewardsTitle = document.createElement('span');
			rewardsTitle.innerHTML = '<strong>Rewards:</strong>';
			statsDiv.appendChild(rewardsTitle);

			this.rewardsTable = document.createElement('table');
			this.rewardsTable.id = 'arena_stats_table';
			statsDiv.appendChild(this.rewardsTable);

			this.button = document.createElement('button');
			this.button.addEventListener('click', this.onStartButton);
			this.button.innerText = 'Start';
			this.div.appendChild(this.button);

			this.updateFight();
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
			Model.state.startFight(this.fight);
			Page.hideCurrent();
		}
		
		onFighterSelected = (fighterIndex: number) =>
		{
			this.fighterUIs[fighterIndex].updateFighter();
			this.updateFight();
		}

		onItemChecked = (fighterIndex: number, itemID: string, value: boolean) =>
		{
			this.fighterUIs[fighterIndex].equipItem(itemID, value);
			this.updateItems();
			this.updateFight();
		}

		updateItems()
		{
			for (let ui of this.fighterUIs)
				ui.updateItems();
		}

		updateFight()
		{
			let awayFightEvent = this.getAwayFightEvent();

			let sideA = this.fighterUIs[0].makeSide();
			let sideB = awayFightEvent ? awayFightEvent.createNPCSide() : this.fighterUIs[1].makeSide();
			this.fight = new Model.Fight.State(sideA, sideB, this.event);

			this.updateStats();
			this.button.disabled = !this.fight || !this.fight.canStart() || !this.fameOK;
		}

		updateStats()
		{
			let tableFactory = new Table.Factory(this.statsTable);

			let addRow = (a: string, b: string) =>
			{
				return tableFactory.addRow([new Table.TextCell(a), new Table.TextCell(b)], false, null);
			};

			let away = this.getAwayFightEvent();
			if (away)
			{
				this.fameOK = this.fighterUIs[0].totalFame >= away.fameRequired;
				let row = addRow('Fame required', away.fameRequired.toString());
				row.style.fontWeight = 'bold';
				row.style.color = this.fameOK ? 'green' : 'red';
			}
			else
			{
				let total = 0;

				for (let ui of this.fighterUIs)
				{
					let label = 'Fighter ' + (ui.index + 1) + " fame";
					addRow(label, ui.totalFame.toString());
					total += ui.totalFame;
				}

				addRow('Arena fame', 'n/a');
				addRow('Total fame', total.toString());

				let attendance = this.getHomeFightEvent().getAttendance(total);
				let row = addRow('Attendance', attendance.toString());
				row.style.fontWeight = 'bold';
			}

			tableFactory = new Table.Factory(this.rewardsTable);
			addRow('Winning fame', this.event.getFameReward(this.fight, true).toString());
			addRow('Losing fame', this.event.getFameReward(this.fight, false).toString());

			if (away)
			{
				addRow('Winning money', this.event.getMoneyReward(this.fight, true).toString());
				addRow('Losing money', this.event.getMoneyReward(this.fight, false).toString());
			}
			else
				addRow('Money', this.event.getMoneyReward(this.fight, false).toString());
		}

		private getHomeFightEvent()
		{
			return Util.dynamicCast(this.event, Model.HomeFightEvent);
		}

		private getAwayFightEvent()
		{
			return Util.dynamicCast(this.event, Model.AwayFightEvent);
		}
	}
}
