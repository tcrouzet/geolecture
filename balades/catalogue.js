import montpellier from './montpellier/parcours.js'
import nimes from './nimes/parcours.js'

export default [
  {
    slug: 'montpellier',
    dossier: 'balades/montpellier/',
    textUrl: 'balades/montpellier/texte.md',
    imageBase: 'balades/montpellier/images/',
    parcours: montpellier,
  },
  {
    slug: 'nimes',
    dossier: 'balades/nimes/',
    textUrl: 'balades/nimes/texte.md',
    imageBase: 'balades/nimes/images/',
    parcours: nimes,
  },
]
