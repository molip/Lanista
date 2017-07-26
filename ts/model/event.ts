namespace Model
{
	export class Event
	{
		constructor(public type: string, public day: number) { }

		static initPrototype(event: Event)
		{
			if (event.type == 'home_fight')
				Util.setPrototype(event, HomeFightEvent);
			else if (event.type == 'away_fight')
				Util.setPrototype(event, AwayFightEvent);
		}

		getDescription() { Util.assert(false); return ''; }
	}

	export class FightRewards
	{
		constructor(public money: number, public fameA: number, public fameB: number) { }
	}

	export class FightEvent extends Event
	{
		constructor(type: string, day: number, public readonly injuryThreshold: number)
		{
			super(type, day);
		}

		applyRewards(fight: Fight.State)
		{
			Util.assert(fight.winnerIndex >= 0);
			const won = fight.winnerIndex == 0;
			const money = this.getMoneyReward(fight, fight.winnerIndex == 0);
			const fameA = this.getFameReward(fight, fight.winnerIndex == 0);
			const fameB = this.getFameReward(fight, fight.winnerIndex == 1);

			Model.state.addMoney(money);
			fight.getFighter(0).addFame(fameA);
			fight.getFighter(1).addFame(fameB);

			return new FightRewards(money, fameA, fameB);
		}

		getFameReward(fight: Fight.State, winning: boolean)
		{
			return 0;
		}

		getMoneyReward(fight: Fight.State, winning: boolean)
		{
			return 0;
		}
	}

	export class HomeFightEvent extends FightEvent
	{
		constructor(day: number, injuryThreshold: number)
		{
			super('home_fight', day, injuryThreshold);
		}

		getDescription()
		{
			return "Home Fight";
		}

		getAttendance(fame: number)
		{
			return Math.floor(fame * Data.Misc.HomeFightPopularity);
		}

		getFameReward(fight: Fight.State, winning: boolean)
		{
			const fame = fight.getFame(); // TODO: Arena fame.
			const rate = winning ? Data.Misc.HomeFightWinningFame : Data.Misc.HomeFightLosingFame;
			return this.getAttendance(fame) * rate;
		}

		getMoneyReward(fight: Fight.State, winning: boolean)
		{
			// Doesn't matter who won.
			const fame = fight.getFame(); // TODO: Arena fame.
			return this.getAttendance(fame) * Data.Misc.HomeFightMoney;
		}
	}

	export class AwayFightEvent extends FightEvent
	{
		constructor(day: number, injuryThreshold: number, public readonly fameRequired: number, public readonly losingFameReward: number, public readonly winningFameReward: number, public readonly losingMoneyReward: number, public readonly winningMoneyReward: number, public readonly name: string)
		{
			super('away_fight', day, injuryThreshold);
		}

		getDescription()
		{
			return this.name;
		}

		createNPCSide()
		{
			let team = new Model.Team();
			team.fighters[1] = new Model.Person(0, 'man', "Slapper Nuremberg", 0);
			team.addItem(ItemType.Weapon, 'halberd');
			let loadout = new Model.Loadout('1');
			loadout.addItem('1', team);
			return new Model.Fight.Side(loadout, team);
		}

		getFameReward(fight: Fight.State, winning: boolean)
		{
			return winning ? this.winningFameReward : this.losingFameReward;
		}

		getMoneyReward(fight: Fight.State, winning: boolean)
		{
			return winning ? this.winningMoneyReward : this.losingMoneyReward;
		}
	}
}
