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

			private getHumanImage(bodyPartTag: string, right: boolean, twoHanded: boolean, attack: boolean)
			{
				let path = 'images/people/man/';

				if (attack)
				{
					path += twoHanded ? 'both arms' : (right ? 'right ' : 'left ') + bodyPartTag;
					path += ' up';
				}
				else
					path += 'idle';

				return path + '.png';
			}

			private getWeaponImage(weaponTag: string, right: boolean, twoHanded: boolean, attack: boolean)
			{
				let path = 'images/people/man/';
				if (!twoHanded)
					path += right ? 'right ' : 'left ';

				path += weaponTag;

				if (attack)
					path += ' up';

				return path + '.png';
			}

			getImages(fighterIndex: number, attack: Attack)
			{
				let fighter = this.getFighter(fighterIndex);
				if (!fighter.isHuman())
					return [fighter.image];

				let images: string[] = [];

				// Add body image.
				let right: boolean = false;
				let twoHanded: boolean = false;
				let bodyPartTag: string = '';

				if (attack)
				{
					let part = fighter.bodyParts[attack.sourceID];

					Util.assert(part.tag in fighter.getSpeciesData().bodyParts);
					Util.assert(fighter.getSpeciesData().bodyParts[part.tag].instances.length == 2); // Arms or legs.

					right = part.index == 1;
					twoHanded = attack.weaponTag && Data.Weapons.Types[attack.weaponTag].sites[0].count == 2 // TODO: What about other sites?
					bodyPartTag = part.tag;
				}

				images.push(this.getHumanImage(bodyPartTag, right, twoHanded, !!attack));

				// Add weapon images.
				let side = this.sides[fighterIndex];
				for (let itemPos of side.loadout.itemPositions)
				{
					let item = side.getTeam().getItem(itemPos.itemID);
					if (item.type == ItemType.Weapon)
					{
						let right = fighter.bodyParts[itemPos.bodyPartIDs[0]].index == 1;
						let twoHanded = itemPos.bodyPartIDs.length == 2;
						let bodyPartTag: string = '';
						let attacking = attack && itemPos.bodyPartIDs.indexOf(attack.sourceID) >= 0;

						images.push(this.getWeaponImage(item.tag, right, twoHanded, attacking));
					}
				}

				return images;
			}

			step()
			{
				let attackerSide = this.sides[this.nextSideIndex];
				this.nextSideIndex = (this.nextSideIndex + 1) % this.sides.length;
				let defenderSide = this.sides[this.nextSideIndex];

				let result = this.attack(attackerSide, defenderSide);

				this.text += result.description + '<br>';
				this.finished = defenderSide.getFighter().isDead();

				Model.invalidate();

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
		}
	}
}
