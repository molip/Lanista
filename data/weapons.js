Data.Weapons.Types = 
{//	id									name		block	cost	image							description				sites (species, site, count)			attacks	(name, type, damage)
	'sword': new Data.Weapons.Type(		'Sword',	20,		50,		'images/items/sword.png',		'Rather stabby',		[new Data.Site('human', 'hand', 1)],	[new Data.Attack('Slash', 'blade', 10)]),
//	'laser': new Data.Weapons.Type(		'Laser',	0,		50,		'images/items/laser.png',		'Particularly burny',	[new Data.Site('rabbit', 'mount', 1)],	[new Data.Attack('Shine', 'fire', 10)]),
	'halberd': new Data.Weapons.Type(	'Halberd',	20,		50,		'images/items/halberd.png',		'Somewhat hacky',		[new Data.Site('human', 'hand', 2)],	[new Data.Attack('Poke', 'pierce', 10), new Data.Attack('Hack', 'blade', 10)]),
};
