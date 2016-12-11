Data.Species.Types = 
{	//				name
	'human':		new Data.Species.Type(	'Human'	),
	'rabbit':		new Data.Species.Type(	'Rabbit'),
	'rhino':		new Data.Species.Type(	'Rhino'),
	'dog':	    	new Data.Species.Type(	'Dog'),
	'lynx':	    	new Data.Species.Type(	'Lynx'),
	'wolf':	    	new Data.Species.Type(	'Wolf'),
	'snake':	   	new Data.Species.Type(	'Snake'),
	'boar':	    	new Data.Species.Type(	'Boar'),
	'goat':	    	new Data.Species.Type(	'Goat'),
	'bear':	    	new Data.Species.Type(	'Bear'),
	'bull':	    	new Data.Species.Type(	'Bull'),
	'lion':	    	new Data.Species.Type(	'Lion'),
	'stag':	    	new Data.Species.Type(	'Stag'),
	'baboon':	   	new Data.Species.Type(	'Baboon'),
	'hippo':	   	new Data.Species.Type(	'Hippo'),
	'scorpion':	   	new Data.Species.Type(	'Scorpion'),
	'giant crab':  	new Data.Species.Type(	'Giant crab'),
	'giant rat':  	new Data.Species.Type(	'Giant rat'),
	'crocodile':  	new Data.Species.Type(	'Crocodile'),
}

var FOUR_LEGS = ['Front left leg', 'Front right leg' , 'Rear right leg' , 'Rear left leg']

Data.Species.Types['human'].bodyParts = 
{	//							health	names						attack (name, type, damage)					weapon site (name, id, replacesAttack)
	'head':	new Data.BodyPart(	100,	['Head'],					null,										null),
	'body':	new Data.BodyPart(	500,	['Body'],					null,										null),
	'arm':	new Data.BodyPart(	200,	['Left arm', 'Right arm'],	new Data.Attack('Punch','impact', 1),		new Data.WeaponSite('Hand', 'hand',	true)),	
	'leg':	new Data.BodyPart(	300,	['Left leg', 'Right leg'],	new Data.Attack('Kick', 'impact', 2),		null),	
}

Data.Species.Types['rabbit'].bodyParts =
{
	'head':	new Data.BodyPart(	30,		['Head'],					new Data.Attack('Bite', 'pierce', 1),		new Data.WeaponSite('Head mount', 'mount', false)),
	'body':	new Data.BodyPart(	50,		['Body'],					null,										null),
}

Data.Species.Types['rhino'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Gore', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
	'leg':	new Data.BodyPart(	100,	FOUR_LEGS,					null,										null),	
}

Data.Species.Types['dog'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Bite', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
}

Data.Species.Types['lynx'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Bite', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
	'body':	new Data.BodyPart(	100,	['Legs'],					new Data.Attack('Claw', 'blade', 1),		null),
}

Data.Species.Types['wolf'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Bite', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
}

Data.Species.Types['snake'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Bite', 'poison', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
}

Data.Species.Types['boar'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Gore', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
}

Data.Species.Types['goat'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Disapprove', 'pierce', 1),	null),
	'body':	new Data.BodyPart(	100,	['Body'],					new Data.Attack('Charge', 'impact', 1),		null),
}

Data.Species.Types['bear'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Bite', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
	'arm':	new Data.BodyPart(	200,	['Left arm', 'Right arm'],	new Data.Attack('Slash', 'blade', 1),		null),	
	'leg':	new Data.BodyPart(	300,	['Left leg', 'Right leg'],	null,										null),	
}

Data.Species.Types['bull'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Gore', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					new Data.Attack('Charge', 'impact', 1),		null),
}

Data.Species.Types['lion'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Bite', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
}

Data.Species.Types['stag'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Gore', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					new Data.Attack('Charge', 'impact', 1),		null),
}

Data.Species.Types['baboon'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Crush', 'crush', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					new Data.Attack('Charge', 'impact', 1),		null),
}

Data.Species.Types['hippo'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Bite', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					new Data.Attack('Charge', 'impact', 1),		null),
}

Data.Species.Types['scorpion'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Sting', 'poison', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
}

Data.Species.Types['giant crab'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Pinch', 'crush', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
}

Data.Species.Types['giant rat'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Bite', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
}

Data.Species.Types['crocodile'].bodyParts =
{
	'head':	new Data.BodyPart(	100,	['Head'],					new Data.Attack('Bite', 'pierce', 1),		null),
	'body':	new Data.BodyPart(	100,	['Body'],					null,										null),
}
