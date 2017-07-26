namespace View
{
	export class BirthdayPage extends FightPage
	{
		//fight: Model.Fight.State;
		//event: Model.AwayFightEvent;
		constructor()
		{
			let event = new Model.AwayFightEvent(0, 0, 0, 0, 0, 0, 0, ''); 

			let fight = new Model.Fight.State(event.createNPCSide(), event.createNPCSide(), event);

			Model.state.startFight(fight);
			super();
		}
	}
}

