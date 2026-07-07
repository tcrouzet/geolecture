const BORDEAUX = {lattitude: 44.83882, longitude: -0.56888};
const PARIS = {latitude: 48.85455, longitude: 2.34901};
const LYON = {latitude:45.75952, longitude: 4.83664};
const BALARUC = {latitude:43.44262, longitude: 3.69029};

//Montpellier
const MARSYAS = {latitude: 43.6106, longitude: 3.88184};
const PRAIRIE = {latitude: 43.61048, longitude: 3.88223};
const COMTE = {latitude: 43.61141, longitude: 3.88297};

//Balaruc
/*const MARSYAS = {latitude: 43.44446, longitude: 3.68914};
const PRAIRIE = {latitude: 43.44431, longitude: 3.68844};
const COMTE = {latitude: 43.44428, longitude: 3.68688};*/

const CROWNE = {latitude: 43.61268, longitude: 3.883074};
const CENTRALE = {latitude: 43.61348, longitude: 3.8869};
const DANSEUSE = {latitude: 43.61017, longitude: 3.89069};
const NEPTUNE = {latitude: 43.60793, longitude: 3.89168};
const EUROPE = {latitude: 43.60766, longitude: 3.89552};
const MARCHES = {latitude: 43.60472, longitude: 3.89746};
const BASSIN = {latitude: 43.6001, longitude: 3.89991};
const BARRAGE = {latitude: 43.59249, longitude: 3.90434};
const TOKAMAK = {latitude: 43.59838, longitude: 3.89793};
const PASSERELLE = {latitude: 43.604, longitude: 3.89608};
const SERGE = {latitude: 43.60436, longitude: 3.89537};
const VESTIGES = {latitude: 43.60576, longitude: 3.89112};
const MENSONGES = {latitude: 43.60635, longitude: 3.89049};
const SQUARE = {latitude: 43.60771, longitude: 3.88621};
const PAVILLON = {latitude: 43.61007, longitude: 3.88215};

export default {
	markers: [
	    {
	      id: 0,
	      title: 'Vous',
	      coordinates: PARIS,
	      km: 0,
	    },{
	      id: 1,
	      title: 'Marsyas',
	      coordinates: MARSYAS,
	      km: 0,
	    },{
	      id: 2,
	      title: 'La Prairie',
	      coordinates: PRAIRIE,
	      km: 36,
	    },{
	      id: 3,
	      title: 'Passerelle Auguste Comte',
	      coordinates: COMTE,
	      km: 156,
	    },{
	      id: 4,
	      title: 'Crowne Plaza',
	      coordinates: CROWNE,
	      km: 186,
	    },{
	      id: 5,
	      title: 'L\'usine',
	      coordinates: CENTRALE,
	      km: 325,
	    },{
	      id: 6,
	      title: 'La danseuse',
	      coordinates: DANSEUSE,
	      km: 509,
	    },{
	      id: 7,
	      title: 'Neptune',
	      coordinates: NEPTUNE,
	      km: 376,
	    },{
	      id: 8,
	      title: 'Le parking',
	      coordinates: EUROPE,
	      km: 321,
	    },{
	      id: 9,
	      title: 'Les marches',
	      coordinates: MARCHES,
	      km: 492,
	    },{
	      id: 10,
	      title: 'Le bassin',
	      coordinates: BASSIN,
	      km: 638,
	    },{
	      id: 11,
	      title: 'Le barrage',
	      coordinates: BARRAGE,
	      km: 1130,
	    },{
	      id: 12,
	      title: 'Le tokamak',
	      coordinates: TOKAMAK,
	      km: 876,
	    },{
	      id: 13,
	      title: 'La passerelle',
	      coordinates: PASSERELLE,
	      km: 763,
	    },{
	      id: 14,
	      title: 'Chez Serge',
	      coordinates: SERGE,
	      km: 76,
	    },{
	      id: 15,
	      title: 'Les vestiges',
	      coordinates: VESTIGES,
	      km: 386,
	    },{
	      id: 16,
	      title: 'Mensonges',
	      coordinates: MENSONGES,
	      km: 105,
	    },{
	      id: 17,
	      title: 'Le square',
	      coordinates: SQUARE,
	      km: 455,
	    },{
	      id: 18,
	      title: 'L\'appartement',
	      coordinates: PAVILLON,
	      km: 624,
	    }
	],
	paths: [

		{id:0, points:[  MARSYAS, {latitude:43.61055, longitude:3.88193}, {latitude: 43.61051, longitude: 3.88203}, PRAIRIE ]},
		{id:1, points:[
			PRAIRIE,
			{latitude: 43.61045, longitude: 3.88249},
			{latitude: 43.6105, longitude: 3.88261},
			{latitude: 43.61058, longitude: 3.88269},
			{latitude: 43.611, longitude: 3.88261},
			{latitude: 43.61118, longitude: 3.8826},
			{latitude: 43.61137, longitude: 3.88255},
			COMTE ]},
		{id:2, points:[
			COMTE,
			{latitude: 43.61142, longitude: 3.88323},
			{latitude: 43.61223, longitude: 3.883094},
			CROWNE ]},
		{id:3, points:[
			CROWNE,
			{latitude: 43.61266, longitude: 3.88331},
			{latitude: 43.61281, longitude: 3.88518},
			{latitude: 43.61309, longitude: 3.88655},
			CENTRALE ]},
		{id:4, points:[
			CENTRALE,
			{latitude: 43.61321, longitude: 3.88808},
			{latitude: 43.61271, longitude: 3.88887},
			{latitude: 43.61214, longitude: 3.88932},
			{latitude: 43.61015, longitude: 3.89033},
			DANSEUSE ]},
		{id:5, points:[
			DANSEUSE,
			{latitude: 43.60995, longitude: 3.89094},
			{latitude: 43.60963, longitude: 3.8909},
			{latitude: 43.60957, longitude: 3.89175},
			{latitude: 43.60875, longitude: 3.89167},
			{latitude: 43.60872, longitude: 3.89208},
			{latitude: 43.60806, longitude: 3.89201},
			NEPTUNE ]},
		{id:6, points:[
			NEPTUNE,
			EUROPE ]},
		{id:7, points:[
			EUROPE,
			{latitude: 43.60751, longitude: 3.89681},
			{latitude: 43.60678, longitude: 3.89675},
			{latitude: 43.60673, longitude: 3.89746},
			{latitude: 43.60632, longitude: 3.89749},
			{latitude: 43.60578, longitude: 3.89728},
			{latitude: 43.60475, longitude: 3.89733},
			MARCHES ]},
		{id:8, points:[
			MARCHES,
			{latitude: 43.60431, longitude: 3.89752},
			{latitude: 43.60423, longitude: 3.89819},
			{latitude: 43.60387, longitude: 3.89867},
			{latitude: 43.59992, longitude: 3.89916},
			BASSIN ]},
		{id:9, points:[
			BASSIN,
			{latitude: 43.60029, longitude: 3.90102},
			{latitude: 43.60024, longitude: 3.90101},
			{latitude: 43.59976, longitude: 3.90187},
			{latitude: 43.59846, longitude: 3.90292},
			{latitude: 43.59827, longitude: 3.90281},
			{latitude: 43.59804, longitude: 3.90301},
			{latitude: 43.59796, longitude: 3.90316},
			{latitude: 43.59428, longitude: 3.90558},
			{latitude: 43.59362, longitude: 3.90417},
			{latitude: 43.59333, longitude: 3.90431},
			{latitude: 43.59324, longitude: 3.90415},
			{latitude: 43.59254, longitude: 3.90453},
			BARRAGE ]},
		{id:10, points:[
			BARRAGE,
			{latitude: 43.59241, longitude: 3.90408},
			{latitude: 43.59361, longitude: 3.90353},
			{latitude: 43.59447, longitude: 3.90276},
			{latitude: 43.59547, longitude: 3.90125},
			{latitude: 43.59691, longitude: 3.89908},
			{latitude: 43.59748, longitude: 3.89858},
			{latitude: 43.59841, longitude: 3.89807},			
			TOKAMAK ]},
		{id:11, points:[
			TOKAMAK,
			{latitude: 43.59854, longitude: 3.89803},
			{latitude: 43.59932, longitude: 3.89761},
			{latitude: 43.59981, longitude: 3.8971},
			{latitude: 43.60069, longitude: 3.89596},
			{latitude: 43.60113, longitude: 3.8956},
			{latitude: 43.60144, longitude: 3.89538},
			{latitude: 43.60361, longitude: 3.89611},
			{latitude: 43.60372, longitude: 3.89597},			
			PASSERELLE ]},
		{id:12, points:[
			PASSERELLE,
			{latitude: 43.60412, longitude: 3.89588},
			{latitude: 43.60428, longitude: 3.89565},
			SERGE ]},
		{id:13, points:[
			SERGE,
			{latitude: 43.60486, longitude: 3.89286},
			{latitude: 43.6051, longitude: 3.8922},
			{latitude: 43.60538, longitude: 3.892},
			VESTIGES ]},
		{id:14, points:[
			VESTIGES,
			{latitude: 43.60589, longitude: 3.89096},
			{latitude: 43.60594, longitude: 3.89051},
			MENSONGES ]},
		{id:15, points:[
			MENSONGES,
			{latitude: 43.60651, longitude: 3.88887},
			{latitude: 43.60714, longitude: 3.88896},
			{latitude: 43.60735, longitude: 3.88647},
			SQUARE ]},
		{id:16, points:[
			SQUARE,
			{latitude: 43.60754, longitude: 3.8863},
			{latitude: 43.60753, longitude: 3.88572},
			{latitude: 43.6075, longitude: 3.88526},
			{latitude: 43.60755, longitude: 3.88496},
			{latitude: 43.60814, longitude: 3.8836},
			{latitude: 43.60874, longitude: 3.8835},
			{latitude: 43.60874, longitude: 3.8835},
			{latitude: 43.60909, longitude: 3.88178},
			{latitude: 43.60963, longitude: 3.88177},
			PAVILLON ]},

	]
}
//{latitude: longitude: },

