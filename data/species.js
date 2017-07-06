// Species.

Data.Species.Types = {
//	tag										name			HP
	'human':		new Data.Species.Type(	'Human', 		40	),
	'rabbit':		new Data.Species.Type(	'Rabbit', 		40	),
	'rhino':		new Data.Species.Type(	'Rhino',		40	),
	'dog':			new Data.Species.Type(	'Dog', 			40	),
	'lynx':			new Data.Species.Type(	'Lynx', 		40	),
	'wolf':			new Data.Species.Type(	'Wolf', 		40	),
	'snake':		new Data.Species.Type(	'Snake', 		40	),
	'boar':			new Data.Species.Type(	'Boar', 		40	),
	'goat':			new Data.Species.Type(	'Goat', 		40	),
	'bear':			new Data.Species.Type(	'Bear', 		40	),
	'bull':			new Data.Species.Type(	'Bull', 		40	),
	'lion':			new Data.Species.Type(	'Lion', 		40	),
	'stag':			new Data.Species.Type(	'Stag', 		40	),
	'baboon':	 	new Data.Species.Type(	'Baboon', 		40	),
	'hippo':	 	new Data.Species.Type(	'Hippo', 		40	),
	'scorpion':	 	new Data.Species.Type(	'Scorpion', 	40	),
	'giant crab':	new Data.Species.Type(	'Giant crab', 	40	),
	'giant rat':	new Data.Species.Type(	'Giant rat', 	40	),
	'crocodile':	new Data.Species.Type(	'Crocodile',	40	),
	'elephant':		new Data.Species.Type(	'Elephant', 	40	),
};

// Body parts for each species.

// attack:				Same as in weapons.js.
// instances:			Name and centre position of each instance of this body part.
// weapon site:
//		tag:			Referred to in weapons.js.
//		replacesAttack:	If true, the body part attack is disabled when this site is occupied.

Data.Species.Types['human'].bodyParts = {
//	tag							attack (name, type, damage)					instances (name, x, y)																					weapon site (name, tag, replacesAttack)
	'head':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Head', 140, 50)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 110, 275)]),
	'arm':	new Data.BodyPart(	new Data.Attack('Punch','impact', 3),		[new Data.BodyPartInstance('Left arm', 255, 430), new Data.BodyPartInstance('Right arm', 5, 470)],		new Data.WeaponSite('Hand', 'hand',	true)),	
	'leg':	new Data.BodyPart(	new Data.Attack('Kick', 'impact', 5),		[new Data.BodyPartInstance('Left leg', 315, 665), new Data.BodyPartInstance('Right leg', 60, 690)]),
};

Data.Species.Types['rabbit'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Nibble', 'pierce', 1),		[new Data.BodyPartInstance('Head', 160, 90)],															new Data.WeaponSite('Head mount', 'mount', false)),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 80, 80)]),	
};

Data.Species.Types['rhino'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Gore', 'pierce', 1),		[new Data.BodyPartInstance('Head', 1090, 330)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 580, 250)]),
};

Data.Species.Types['dog'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Bite', 'pierce', 1),		[new Data.BodyPartInstance('Head', 410, 40)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 210, 160)]),
};

Data.Species.Types['lynx'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Bite', 'pierce', 4),		[new Data.BodyPartInstance('Head', 340, 70)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 190, 60)]),
	'legs':	new Data.BodyPart(	new Data.Attack('Claw', 'blade', 6),		[new Data.BodyPartInstance('Legs', 180, 170)]),
};

Data.Species.Types['wolf'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Bite', 'pierce', 5),		[new Data.BodyPartInstance('Head', 420, 80)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 200, 90)]),
	'legs':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Legs', 185, 245)]),
};

Data.Species.Types['snake'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Bite', 'poison', 1),		[new Data.BodyPartInstance('Head', 170, 30)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 130, 180)]),
};

Data.Species.Types['boar'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Gore', 'pierce', 1),		[new Data.BodyPartInstance('Head', 500, 120)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 290, 170)]),
};

Data.Species.Types['goat'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Disapprove', 'pierce', 1),	[new Data.BodyPartInstance('Head', 480, 120)]),
	'body':	new Data.BodyPart(	new Data.Attack('Charge', 'impact', 1),		[new Data.BodyPartInstance('Body', 270, 170)]),
};

Data.Species.Types['bear'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Bite', 'pierce', 1),		[new Data.BodyPartInstance('Head', 950, 200)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 480, 180)]),
	'arm':	new Data.BodyPart(	new Data.Attack('Slash', 'blade', 1),		[new Data.BodyPartInstance('Arms', 680, 440)]),	
	'leg':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Legs', 170, 440)]),	
};

Data.Species.Types['bull'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Gore', 'pierce', 1),		[new Data.BodyPartInstance('Head', 1260, 200)]),
	'body':	new Data.BodyPart(	new Data.Attack('Charge', 'impact', 1),		[new Data.BodyPartInstance('Body', 780, 350)]),
};

Data.Species.Types['lion'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Bite', 'pierce', 1),		[new Data.BodyPartInstance('Head', 160,90)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 80, 80)]),	
};

Data.Species.Types['stag'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Gore', 'pierce', 1),		[new Data.BodyPartInstance('Head', 800, 400)]),
	'body':	new Data.BodyPart(	new Data.Attack('Charge', 'impact', 1),		[new Data.BodyPartInstance('Body', 390, 460)]),	
};

Data.Species.Types['baboon'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Crush', 'crush', 1),		[new Data.BodyPartInstance('Head', 160,90)]),
	'body':	new Data.BodyPart(	new Data.Attack('Charge', 'impact', 1),		[new Data.BodyPartInstance('Body', 80, 80)]),	
};

Data.Species.Types['hippo'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Bite', 'pierce', 1),		[new Data.BodyPartInstance('Head', 160,90)]),
	'body':	new Data.BodyPart(	new Data.Attack('Charge', 'impact', 1),		[new Data.BodyPartInstance('Body', 80, 80)]),	
};

Data.Species.Types['scorpion'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Sting', 'poison', 1),		[new Data.BodyPartInstance('Head', 1540, 260)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 820, 430)]),
};

Data.Species.Types['giant crab'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Pinch', 'crush', 1),		[new Data.BodyPartInstance('Head', 810, 260)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 390, 400)]),
};

Data.Species.Types['giant rat'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Bite', 'pierce', 1),		[new Data.BodyPartInstance('Head', 850, 250)]),
	'body':	new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 430, 250)]),
};

Data.Species.Types['crocodile'].bodyParts =
{
	'head': new Data.BodyPart(	new Data.Attack('Bite', 'pierce', 1),		[new Data.BodyPartInstance('Head', 160, 90)]),
	'body': new Data.BodyPart(	null,										[new Data.BodyPartInstance('Body', 80, 80)]),
};

Data.Species.Types['elephant'].bodyParts =
{
	'head':	new Data.BodyPart(	new Data.Attack('Gore', 'pierce', 1),		[new Data.BodyPartInstance('Head', 1540, 260)]),
	'body':	new Data.BodyPart(	new Data.Attack('Charge', 'impact', 1),		[new Data.BodyPartInstance('Body', 820, 430)]),
};
