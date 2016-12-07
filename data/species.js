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
};


Data.Species.Types['human'].bodyParts = 
{	//							health	names						attack (name, type, damage)								weapon site (name, id, replacesAttack)
	'head':	new Data.BodyPart(	10,		['Head'],					null,													null),
	'body':	new Data.BodyPart(	50,		['Body'],					new Data.Attack('Kick', 'impact', 2),					null),
	'arm':	new Data.BodyPart(	20,		['Left arm', 'Right arm'],	new Data.Attack('Punch','impact', 1),					new Data.WeaponSite('Hand', 'hand',	true)),	
	'leg':	new Data.BodyPart(	30,		['Left leg', 'Right leg'],	new Data.Attack('Kick', 'impact', 2),					null),	
}

Data.Species.Types['rabbit'].bodyParts = 
{
	'head':	new Data.BodyPart(	3,		['Head'],					new Data.Attack('Bite', 'blade', 1),					new Data.WeaponSite('Head mount', 'mount', false)),
	'body':	new Data.BodyPart(	5,		['Body'],					null,													null),
}
Data.Species.Types['rhino'].bodyParts = 
{
	'head':	new Data.BodyPart(	3,		['Head'],					new Data.Attack('Charge', 'piercing', 35),				new Data.WeaponSite('Head mount', 'mount', false)),
	'body':	new Data.BodyPart(	5,		['Body'],					null,													null),
	'leg':	new Data.BodyPart(	30,		['Front left leg', 'Front right leg' , 'Rear right leg' , 'Rear left leg'],	null,	null),	
}
