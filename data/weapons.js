Data.Weapons.Types = 
{//	id								name		block	cost	image	description		sites (name	count)				attacks	(name, type, damage)
	'sword': new Data.Weapons.Type(	'Sword',	20,		50,		'',		'',				[new Data.Site(	'hand',	1)],	[new Data.Attack('Slash', 'blade', 10)]),
	'laser': new Data.Weapons.Type(	'Laser',	0,		50,		'',		'',				[new Data.Site(	'mount', 1)],	[new Data.Attack('Shine', 'fire', 10)]),
};
