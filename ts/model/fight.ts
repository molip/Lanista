"use strict";

namespace Model
{
	export namespace Fight
	{
		export class AttackResult
		{
			constructor(public name: string, public description: string, public attackDamage: number, public defense: number, public sourceID: string, public targetID: string) { }
		}

		export class Team 
		{
			constructor(private fighter: string | Fighter) { }

			getFighter() 
			{
				return typeof this.fighter === "string" ? Model.state.fighters[this.fighter] : this.fighter;
			}

			onLoad()
			{
				if (typeof this.fighter !== "string")
					Fighter.initPrototype(this.fighter);
			}
		}

		export class State
		{
			private teams: Team[]; 
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

			onLoad()
			{
				for (let team of this.teams)
				{
					Util.setPrototype(team, Team);
					team.onLoad();
				}
			}

			getFighter(index: number) 
			{
				return this.teams[index].getFighter();
			}

			step()
			{
				let attacker = this.getFighter(this.nextTeamIndex);
				this.nextTeamIndex = (this.nextTeamIndex + 1) % this.teams.length;
				let defender = this.getFighter(this.nextTeamIndex);

				let result = this.attack(attacker, defender);

				this.text += result.description + '<br>';
				this.finished = defender.isDead();

				Model.saveState();

				return result;
			}

			attack(attacker: Fighter, defender: Fighter)
			{
				let attacks = attacker.getAttacks();
				let attack = attacks[Util.getRandomInt(attacks.length)];

				let defenderSpeciesData = defender.getSpeciesData();
				let targetID = defender.chooseRandomBodyPart();
				let target = defender.bodyParts[targetID];
				let targetData = target.getData(defenderSpeciesData);

				let armour = defender.getBodyPartArmour(target.id);
				let armourData = armour ? Data.Armour.Types[armour.tag] : null;

				let defense = armourData ? armourData.getDefense(attack.data.type) : 0;
				let damage = attack.data.damage * (100 - defense) / 100;

				let oldHealth = target.health;
				target.health = Math.max(0, oldHealth - damage);

				let msg = attacker.name + ' uses ' + attack.data.name + ' on ' + defender.name + ' ' + targetData.instances[target.index].name + '. ';
				msg += 'Damage = ' + attack.data.damage + ' x ' + (100 - defense) + '% = ' + damage.toFixed(1) + '. ';
				msg += 'Health ' + oldHealth.toFixed(1) + ' -> ' + target.health.toFixed(1) + '. ';
				return new AttackResult(attack.data.name, msg, attack.data.damage, defense, attack.sourceID, targetID); 
			}
		}
	}
}
