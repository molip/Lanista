Data.Species.Types = { //					name
	'human':		new Data.Species.Type(	'Human'	),
	'rabbit':		new Data.Species.Type(	'Rabbit'),
};


Data.Species.Types['human'].bodyParts = {
	//							health	names							
	'head':	new Data.BodyPart(	10,		['Head']					),
	'body':	new Data.BodyPart(	50,		['Body']					),
	'arm':	new Data.BodyPart(	20,		['Left arm', 'Right arm']	),	
	'leg':	new Data.BodyPart(	30,		['Left leg', 'Right leg']	),	
}

Data.Species.Types['rabbit'].bodyParts = {
	'head':	new Data.BodyPart(	5,		['Head']	),
	'body':	new Data.BodyPart(	5,		['Body']	),
}


// Attacks																	name		type		damage
Data.Species.Types['human'].bodyParts['arm'].attack		= new Data.Attack(	'Punch',	'impact',	1	)
Data.Species.Types['human'].bodyParts['leg'].attack		= new Data.Attack(	'Kick',		'impact',	2	)
Data.Species.Types['rabbit'].bodyParts['head'].attack	= new Data.Attack(	'Bite',		'blade',	1	)

