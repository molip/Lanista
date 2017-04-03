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
	'crocodile':	new Data.Species.Type(	'Crocodile'),
	'elephant':		new Data.Species.Type(	'Elephant'),
}

Data.Species.Types['human'].bodyParts = 
{	//							health	attack (name, type, damage)					weapon site (name, id, replacesAttack)				instances (name, x, y)
	'head':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Head', 0, 0)]),
	'body':	new Data.BodyPart(	50,		null,										null,												[new Data.BodyPartInstance('Body', 0, 0)]),
	'arm':	new Data.BodyPart(	20,		new Data.Attack('Punch','impact', 1),		new Data.WeaponSite('Hand', 'hand',	true),			[new Data.BodyPartInstance('Left arm', 0, 0), new Data.BodyPartInstance('Right arm', 0, 0)]),	
	'leg':	new Data.BodyPart(	30,		new Data.Attack('Kick', 'impact', 2),		null,												[new Data.BodyPartInstance('Left leg', 0, 0), new Data.BodyPartInstance('Right leg', 0, 0)]),
}

Data.Species.Types['rabbit'].bodyParts =
{
	'head':	new Data.BodyPart(	3,		new Data.Attack('Bite', 'pierce', 1),		new Data.WeaponSite('Head mount', 'mount', false),	[new Data.BodyPartInstance('Head', 160, 90)]),
	'body':	new Data.BodyPart(	5,		null,										null,												[new Data.BodyPartInstance('Body', 80, 80)]),	
}

Data.Species.Types['rhino'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Gore', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 1090, 330)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 580, 250)]),
}

Data.Species.Types['dog'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Bite', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 410, 40)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 210, 160)]),
}

Data.Species.Types['lynx'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Bite', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 340, 70)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 190, 60)]),
	'legs':	new Data.BodyPart(	10,		new Data.Attack('Claw', 'blade', 1),		null,												[new Data.BodyPartInstance('Legs', 180, 170)]),
}

Data.Species.Types['wolf'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Bite', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 420, 80)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 200, 90)]),
}

Data.Species.Types['snake'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Bite', 'poison', 1),		null,												[new Data.BodyPartInstance('Head', 170, 30)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 130, 180)]),
}

Data.Species.Types['boar'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Gore', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 500, 120)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 290, 170)]),
}

Data.Species.Types['goat'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Disapprove', 'pierce', 1),	null,												[new Data.BodyPartInstance('Head', 480, 120)]),
	'body':	new Data.BodyPart(	10,		new Data.Attack('Charge', 'impact', 1),		null,												[new Data.BodyPartInstance('Body', 270, 170)]),
}

Data.Species.Types['bear'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Bite', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 950, 200)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 480, 180)]),
	'arm':	new Data.BodyPart(	20,		new Data.Attack('Slash', 'blade', 1),		null,												[new Data.BodyPartInstance('Arms', 680, 440)]),	
	'leg':	new Data.BodyPart(	30,		null,										null,												[new Data.BodyPartInstance('Legs', 170, 440)]),	
}

Data.Species.Types['bull'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Gore', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 1260, 200)]),
	'body':	new Data.BodyPart(	10,		new Data.Attack('Charge', 'impact', 1),		null,												[new Data.BodyPartInstance('Body', 780, 350)]),
}

Data.Species.Types['lion'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Bite', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 160,90)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 80, 80)]),	
}

Data.Species.Types['stag'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Gore', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 800, 400)]),
	'body':	new Data.BodyPart(	10,		new Data.Attack('Charge', 'impact', 1),		null,												[new Data.BodyPartInstance('Body', 390, 460)]),	
}

Data.Species.Types['baboon'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Crush', 'crush', 1),		null,												[new Data.BodyPartInstance('Head', 160,90)]),
	'body':	new Data.BodyPart(	10,		new Data.Attack('Charge', 'impact', 1),		null,												[new Data.BodyPartInstance('Body', 80, 80)]),	
}

Data.Species.Types['hippo'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Bite', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 160,90)]),
	'body':	new Data.BodyPart(	10,		new Data.Attack('Charge', 'impact', 1),		null,												[new Data.BodyPartInstance('Body', 80, 80)]),	
}

Data.Species.Types['scorpion'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Sting', 'poison', 1),		null,												[new Data.BodyPartInstance('Head', 1540, 260)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 820, 430)]),
}

Data.Species.Types['giant crab'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Pinch', 'crush', 1),		null,												[new Data.BodyPartInstance('Head', 810, 260)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 390, 400)]),
}

Data.Species.Types['giant rat'].bodyParts =
{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Bite', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 850, 250)]),
	'body':	new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 430, 250)]),
}

Data.Species.Types['crocodile'].bodyParts =
{
	'head': new Data.BodyPart(	10,		new Data.Attack('Bite', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 160, 90)]),
	'body': new Data.BodyPart(	10,		null,										null,												[new Data.BodyPartInstance('Body', 80, 80)]),
}
Data.Species.Types['elephant'].bodyParts =
	{
	'head':	new Data.BodyPart(	10,		new Data.Attack('Gore', 'pierce', 1),		null,												[new Data.BodyPartInstance('Head', 1540, 260)]),
	'body':	new Data.BodyPart(	10,		new Data.Attack('Charge', 'impact', 1),		null,												[new Data.BodyPartInstance('Body', 820, 430)]),
	}
