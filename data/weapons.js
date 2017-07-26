// Weapons which appears in the Weapons shop.

// block:	Not currently used.
// sites:	Same as in armour.js.
// attacks:
//		type:			Damage type (see armour.js)
//		damage:			How much damage gets done. This gets modified by armour.

Data.Weapons.Types = {
//	tag									name		block	cost	fame	description				sites (species, site, count)			attacks	(name, type, damage)
	'sword': new Data.Weapons.Type(		'Sword',	20,		50,		2,		'Rather stabby',		[new Data.Site('human', 'hand', 1)],	[new Data.Attack('Slash', 'blade', 10)]),
//	'laser': new Data.Weapons.Type(		'Laser',	0,		50,		2,		'Particularly burny',	[new Data.Site('rabbit', 'mount', 1)],	[new Data.Attack('Shine', 'fire', 10)]),
	'halberd': new Data.Weapons.Type(	'Halberd',	20,		50,		2,		'Somewhat hacky',		[new Data.Site('human', 'hand', 2)],	[new Data.Attack('Poke', 'pierce', 10), new Data.Attack('Hack', 'blade', 10)]),
	'happy': new Data.Weapons.Type(	'Halberd',	20,		50,		2,		'Somewhat hacky',		[new Data.Site('human', 'hand', 2)],	[new Data.Attack('Swish', 'pierce', 10)]),
	'jim': new Data.Weapons.Type(	'Halberd',	20,		50,		2,		'Somewhat hacky',		[new Data.Site('human', 'hand', 2)],	[new Data.Attack('Flourish', 'pierce', 10)]),
};
