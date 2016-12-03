Data.Species.Types = 
{	//				name
	'human':		new Data.Species.Type(	'Human'	),
	'rabbit':		new Data.Species.Type(	'Rabbit'),
};


Data.Species.Types['human'].bodyParts = 
{	//							health	names						attack (name, type, damage)				weapon site (name, id, replacesAttack)
	'head':	new Data.BodyPart(	10,		['Head'],					null,									null),
	'body':	new Data.BodyPart(	50,		['Body'],					new Data.Attack('Kick', 'impact', 2),	null),
	'arm':	new Data.BodyPart(	20,		['Left arm', 'Right arm'],	new Data.Attack('Punch','impact', 1),	new Data.WeaponSite('Hand', 'hand',	true)),	
	'leg':	new Data.BodyPart(	30,		['Left leg', 'Right leg'],	new Data.Attack('Kick', 'impact', 2),	null),	
}

Data.Species.Types['rabbit'].bodyParts = 
{
	'head':	new Data.BodyPart(	3,		['Head'],					new Data.Attack('Bite', 'blade', 1),	new Data.WeaponSite('Head mount', 'mount', false)),
	'body':	new Data.BodyPart(	5,		['Body'],					null,									null),
}
