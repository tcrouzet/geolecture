const PARIS = {latitude: 48.85455, longitude: 2.34901};

//Nîmes
const MENARD = {latitude: 43.8418, longitude: 4.35572};
const MAGNE = {latitude: 43.84276, longitude: 4.34933};
const DIANE = {latitude: 43.83993, longitude: 4.34896};
const ANTONIN = {latitude: 43.83944, longitude: 4.35504};
const FAC = {latitude: 43.84257, longitude: 4.35694};
const POTERNE = {latitude: 43.84191, longitude: 4.35719};

export default {
	markers: [
	    {
	      id: 0,
	      title: 'Vous',
	      coordinates: PARIS,
	      km: 0,
	    },{
	      id: 1,
	      title: 'Rue Ménard',
	      coordinates: MENARD,
	      km: 300,
	    },{
	      id: 2,
	      title: 'Tour Magne',
	      coordinates: MAGNE,
	      km: 680,
	    },{
	      id: 3,
	      title: 'Temple de Diane',
	      coordinates: DIANE,
	      km: 530,
	    },{
	      id: 4,
	      title: 'Anonin',
	      coordinates: ANTONIN,
	      km: 550,
	    },{
	      id: 5,
	      title: 'Poterne',
	      coordinates: POTERNE,
	      km: 470,
	    }
	],
	paths: [

		{id:0, points:[ 
			MENARD,
			{latitude: 43.84217, longitude: 4.35547},
			{latitude: 43.84208, longitude: 4.3552},
			{latitude: 43.84185, longitude: 4.35431},
			{latitude: 43.84207, longitude: 4.35419},
			{latitude: 43.84232, longitude: 4.35379},
			{latitude: 43.84256, longitude: 4.3531},
			{latitude: 43.84283, longitude: 4.35269},
			{latitude: 43.84347, longitude: 4.35195},
			{latitude: 43.84362, longitude: 4.35158},
			{latitude: 43.84322, longitude: 4.34979},
			{latitude: 43.84283, longitude: 4.34969},
			MAGNE ]},
		{id:1, points:[
			MAGNE,
			{latitude: 43.84258, longitude: 4.3493},
			{latitude: 43.84242, longitude: 4.34938},
			{latitude: 43.84208, longitude: 4.34921},
			{latitude: 43.84175, longitude: 4.34926},
			{latitude: 43.84162, longitude: 4.34948},
			{latitude: 43.8417, longitude: 4.35001},
			{latitude: 43.84175, longitude: 4.35065},
			{latitude: 43.84157, longitude: 4.35016},
			{latitude: 43.84125, longitude: 4.34876},
			{latitude: 43.84071, longitude: 4.34839},
			{latitude: 43.84012, longitude: 4.34844},
			DIANE ]},
		{id:2, points:[
			DIANE,
			{latitude: 43.8397, longitude: 4.34954},
			{latitude: 43.83981, longitude: 4.35042},
			{latitude: 43.83934, longitude: 4.35115},
			{latitude: 43.83898, longitude: 4.35215},
			ANTONIN ]},
		{id:3, points:[
			ANTONIN,
			{latitude: 43.83969, longitude: 4.35537},
			{latitude: 43.83987, longitude: 4.35574},
			{latitude: 43.84033, longitude: 4.35636},
			{latitude: 43.84041, longitude: 4.35679},
			{latitude: 43.84127, longitude: 4.35664},
			POTERNE ]},
	],
	initpath:

		{id:0, points:[
			FAC,
			{latitude: 43.84193, longitude: 4.3572},
			{latitude: 43.84129, longitude: 4.35665},
			{latitude: 43.84123, longitude: 4.35658},
			{latitude: 43.84109, longitude: 4.35602},
			MENARD
		]}
}
