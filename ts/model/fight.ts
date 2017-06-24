"use strict";

namespace Model
{
	export namespace Fight
	{
		export class AttackResult
		{
			constructor(public name: string, public description: string, public attackDamage: number, public defense: number, public sourceID: string, public targetID: string) { }
		}

		export class Side
		{
			loadout: Loadout;

			constructor(private fighterID: string, private npcTeam: Team)
			{
				Util.assert(!npcTeam || npcTeam !== Model.state.team); // Use null for player team.

				let team = this.getTeam();
				this.loadout = new Loadout(fighterID);

				for (let id in team.items)
					if (this.loadout.canAddItem(id, team))
						this.loadout.addItem(id, team);
			}

			getFighter() 
			{
				return this.getTeam().fighters[this.fighterID];
			}

			getTeam()
			{
				return this.npcTeam ? this.npcTeam : Model.state.team;
			}

			onLoad()
			{
				if (this.npcTeam)
				{
					Util.setPrototype(this.npcTeam, Team);
					this.npcTeam.onLoad();
				}

				Util.setPrototype(this.loadout, Loadout);
				this.loadout.onLoad();
			}
		}

		export class State
		{
			private sides: Side[];
			text: string;
			nextSideIndex: number;
			steps: number;
			finished: boolean;
			constructor(sideA: Side, sideB: Side)
			{
				this.sides = [sideA, sideB];
				this.text = '';
				this.nextSideIndex = 0;
				this.steps = 0;
				this.finished = false;
			}

			onLoad()
			{
				for (let side of this.sides)
				{
					Util.setPrototype(side, Side);
					side.onLoad();
				}
			}

			getFighter(index: number) 
			{
				return this.sides[index].getFighter();
			}

			step()
			{
				let attackerSide = this.sides[this.nextSideIndex];
				this.nextSideIndex = (this.nextSideIndex + 1) % this.sides.length;
				let defenderSide = this.sides[this.nextSideIndex];

				let result = this.attack(attackerSide, defenderSide);

				this.text += result.description + '<br>';
				this.finished = defenderSide.getFighter().isDead();

				Model.saveState();

				return result;
			}

			attack(attackerSide: Side, defenderSide: Side)
			{
				let attacker = attackerSide.getFighter();
				let defender = defenderSide.getFighter();

				let attacks = attacker.getAttacks(attackerSide.loadout, attackerSide.getTeam());
				let attack = attacks[Util.getRandomInt(attacks.length)];

				let defenderSpeciesData = defender.getSpeciesData();
				let targetID = defender.chooseRandomBodyPart();
				let target = defender.bodyParts[targetID];
				let targetData = target.getData(defenderSpeciesData);

				let armourData = defenderSide.loadout.getBodyPartArmourData(target.id, defenderSide.getTeam());

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
