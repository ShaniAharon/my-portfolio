'use strict';
console.log('Starting up');

var gProjs = [
  {
    id: 'chess',
    name: 'Chess Demo',
    title: 'Better push those boxes',
    desc: 'lorem ipsum lorem ipsum lorem ipsum',
    imgSrc: 'img/proj-pic/chess.png',
    url: 'projs/chess/index.html',
    publishedAt: 1448693940000,
    labels: ['Matrixes', 'keyboard events'],
  },
];

function getProjs() {
  return gProjs;
}

function getProjById(projId) {
  return gProjs.find((proj) => proj.id === projId);
}
