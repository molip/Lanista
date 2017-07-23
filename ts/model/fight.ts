namespace Model
{
	export namespace Fight
	{
		export class AttackResult
		{
			constructor(public attack:Attack, public description: string, public attackDamage: number, public defense: number, public targetID: string) { }
		}

		export class Side
		{
			constructor(public loadout: Model.Loadout, private npcTeam: Team)
			{
				Util.assert(!npcTeam || npcTeam !== Model.state.team); // Use null for player team.

				let team = this.getTeam();
				Util.assert(!!team.fighters[loadout.fighterID]);
			}

			getFighter() 
			{
				return this.getTeam().fighters[this.loadout.fighterID];
			}

			getTeam()
			{
				return this.npcTeam ? this.npcTeam : Model.state.team;
			}

			getAttacks()
			{
				return this.getFighter().getAttacks(this.loadout, this.getTeam());
			}

			getEquipmentFame()
			{
				return this.loadout.getEquipmentFame(this.getTeam());
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
			winnerIndex = -1;
			constructor(sideA: Side, sideB: Side, private event: FightEvent)
			{
				this.sides = [sideA, sideB];
				this.text = '';
				this.nextSideIndex = 0;
				this.steps = 0;
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

			getImages(fighterIndex: number, attack: Attack)
			{
				let fighter = this.getFighter(fighterIndex);
				if (!fighter.isHuman())
					return [fighter.image];

				let basePath = 'images/people/man/';

				let images: string[] = [];

				// Add body image.
				let bodyImage = 'idle';
				if (attack)
				{
					let part = fighter.bodyParts[attack.sourceID];

					Util.assert(part.tag in fighter.getSpeciesData().bodyParts);
					Util.assert(fighter.getSpeciesData().bodyParts[part.tag].instances.length == 2); // Arms or legs.

					bodyImage = (part.index == 1 ? 'right ' : 'left ') + part.tag + ' up';

					if (attack.weaponTag && Data.Weapons.Types[attack.weaponTag].sites[0].count == 2) // TODO: What about other sites? 
						bodyImage = 'both arms up';
				}

				images.push(basePath + bodyImage + '.png');

				// Add weapon images.
				let side = this.sides[fighterIndex];
				for (let itemPos of side.loadout.itemPositions)
				{
					let item = side.getTeam().getItem(itemPos.itemID);
					if (item.type == ItemType.Weapon)
					{
						let weaponPath = '';
						if (itemPos.bodyPartIDs.length == 1) // Single-handed.
							weaponPath = fighter.bodyParts[itemPos.bodyPartIDs[0]].index == 1 ? 'right ' : 'left ';

						weaponPath += item.tag;

						if (attack && itemPos.bodyPartIDs.indexOf(attack.sourceID) >= 0)
							weaponPath += ' up';

						images.push(basePath + weaponPath + '.png');
					}
				}

				return images;
			}

			private addAllImagesForFighter(index: number, set: Set<string>)
			{
				for (let image of this.getImages(index, null))
					set.add(image);

				for (let attack of this.sides[index].getAttacks())
					for (let image of this.getImages(index, attack))
						set.add(image);
			}

			getAllImages()
			{
				let set: Set<string> = new Set();
				for (let i = 0; i < 2; ++i)
					this.addAllImagesForFighter(i, set);

				return Array.from(set);
			}

			step()
			{
				let attackerIndex = this.nextSideIndex;
				let defenderIndex = (this.nextSideIndex + 1) % this.sides.length;

				let attackerSide = this.sides[attackerIndex];
				let defenderSide = this.sides[defenderIndex];

				let result = this.attack(attackerSide, defenderSide);

				this.text += result.description + '<br>';
				if (!this.isFighterOK(defenderSide.getFighter()))
				{
					this.winnerIndex = attackerIndex;
					this.text += attackerSide.getFighter().name + ' has won the fight!<br>';
				}
				else
					this.nextSideIndex = defenderIndex;

				Model.invalidate();

				return result;
			}

			attack(attackerSide: Side, defenderSide: Side)
			{
				let attacker = attackerSide.getFighter();
				let defender = defenderSide.getFighter();

				let attacks = attackerSide.getAttacks();
				let attack = attacks[Util.getRandomInt(attacks.length)];

				let defenderSpeciesData = defender.getSpeciesData();
				let targetID = defender.chooseRandomBodyPart();
				let target = defender.bodyParts[targetID];
				let targetData = target.getData(defenderSpeciesData);

				let baseDamage = 0;
				let defense = 0;
				let attackSkill = Math.floor(attack.skill);
				let evadeSkill = Math.floor(defender.getSkill('evade'));

				let msg = attacker.name + ' uses ' + attack.data.name + ' on ' + defender.name + ' ' + targetData.instances[target.index].name + '. ';
				msg += 'Skill = ' + Data.Misc.BaseAttackSkill + ' + ' + attackSkill + ' - ' + evadeSkill + '. ';

				if (Util.getRandomInt(100) < Data.Misc.BaseAttackSkill + attackSkill - evadeSkill)
				{
					let armourData = defenderSide.loadout.getBodyPartArmourData(target.id, defenderSide.getTeam());

					defense = armourData ? armourData.getDefense(attack.data.type) : 0;
					baseDamage = attack.data.damage;
					let damage = baseDamage * (100 - defense) / 100;

					let oldHealth = defender.health;
					defender.health = Math.max(0, oldHealth - damage);

					msg += 'Damage = ' + baseDamage + ' x ' + (100 - defense) + '% = ' + damage.toFixed(1) + '. ';
				}
				else
				{
					msg += 'Missed!';
				}

				Model.invalidate();

				return new AttackResult(attack, msg, baseDamage, defense, targetID);
			}

			isFighterOK(fighter: Fighter)
			{
				return fighter.canFight(this.event.injuryThreshold);
			}

			canStart()
			{
				let fighterA = this.getFighter(0);
				let fighterB = this.getFighter(1);
				return fighterA !== fighterB && this.isFighterOK(fighterA) && this.isFighterOK(fighterB);
			}

			getFame()
			{
				let fame = 0;
				for (let side of this.sides)
					fame += side.getEquipmentFame() + side.getFighter().fame;

				return fame;
			}
		}
	}
}
