"use strict";

namespace Model
{
	export namespace Fight
	{
		export type Team = string[]; // Fighter IDs. 
		export class State
		{
			teams: Team[]; 
			text: string;
			nextTeamIndex: number;
			steps: number;
			finished: boolean;
			constructor(teamA: Team, teamB: Team)
			{
				this.teams = [teamA, teamB];
				this.text = '';
				this.nextTeamIndex = 0;
				this.steps = 0;
				this.finished = false;
			}

			step()
			{
				// Assume 2 teams of 1 fighter each. 
				let attacker = Model.state.fighters[this.teams[this.nextTeamIndex][0]];
				this.nextTeamIndex = (this.nextTeamIndex + 1) % this.teams.length;
				let defender = Model.state.fighters[this.teams[this.nextTeamIndex][0]];

				let result = this.attack(attacker, defender);

				this.text += result.text + '<br>';
				this.finished = result.dead;

				return this.finished;
			}

			attack(attacker: Fighter, defender: Fighter)
			{
				let attacks = attacker.getAttacks();
				let attackData = attacks[Util.getRandomInt(attacks.length)];

				let defenderSpeciesData = defender.getSpeciesData();
				let targets = defender.getBodyParts();
				let target = targets[Util.getRandomInt(targets.length)];
				let targetData = target.getData(defenderSpeciesData);

				let armour = defender.getBodyPartArmour(target.id);
				let armourData = armour ? Data.Armour.Types[armour.tag] : null;

				let defense = armourData ? armourData.getDefense(attackData.type) : 0;
				let damage = attackData.damage * (100 - defense) / 100;

				let oldHealth = targetData.health;
				targetData.health = Math.max(0, targetData.health - damage);

				let msg = attacker.name + ' uses ' + attackData.name + ' on ' + defender.name + ' ' + targetData.names[target.index] + '. ';
				msg += 'Damage = ' + attackData.damage + ' x ' + (100 - defense) + '% = ' + damage.toFixed(1) + '. ';
				msg += 'Health ' + oldHealth.toFixed(1) + ' -> ' + targetData.health.toFixed(1) + '. ';
				return { text: msg, dead: targetData.health == 0 };
			}
		}
	}
}
