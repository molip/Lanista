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
		money: number = 0;
		fame: number[] = [];
	}

	export class FightEvent extends Event
	{
		constructor(type: string, day: number, public readonly injuryThreshold: number)
		{
			super(type, day);
		}

		getRewards(fight: Fight.State)
		{
			Util.assert(fight.winnerIndex >= 0);

			let rewards = new FightRewards();

			rewards.money = this.getMoneyReward(fight, fight.winnerIndex == 0);
			for (let i = 0; i < 2; ++i)
				rewards.fame.push(this.getFameReward(fight, fight.winnerIndex == i));

			return rewards;
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
			return this.name + ' (' + this.fameRequired + ' fame required)';
		}

		createNPCSide()
		{
			let team = new Model.Team();
			team.fighters[1] = new Model.Person(0, 'man', "Slapper Nuremberg", 0);
			let loadout = new Model.Loadout('1');
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
