'use strict';
console.log('Starting up');

//make create proj func
var gProjs = [
  {
    id: 'chess',
    name: 'Chess Demo',
    title: 'Better push those boxes',
    desc: 'The best board game',
    imgSrc: 'img/proj-pic/chess.png',
    url: 'projs/chess/index.html',
    publishedAt: 1448693940000,
    labels: ['Matrixes', 'keyboard events'],
  },
  {
    id: 'pacman',
    name: 'Pacman',
    title: 'Better push those boxes',
    desc: 'Old and nostalgic game ',
    imgSrc: 'img/proj-pic/pacman.png',
    url: 'projs/pacman/index.html',
    publishedAt: 1448693940000,
    labels: ['Matrixes', 'keyboard events'],
  },
  {
    id: 'minesweeper',
    name: 'MineSweeper',
    title: 'Better push those boxes',
    desc: 'watch out from the mines',
    imgSrc: 'img/proj-pic/minesweeper.png',
    url: 'projs/minesweeper/index.html',
    publishedAt: 1448693940000,
    labels: ['Matrixes', 'keyboard events'],
  },
];

function getProjs() {
  return gProjs;
}

// function createProj(id, name, imgSrc, url) {
//   var proj = {
//     id,
//     name,
//     imgSrc,
//     url,
//     publishedAt: Date.now(),
//   };
//   return proj;
// }

// function createProjs() {

// }

function getProjById(projId) {
  return gProjs.find((proj) => proj.id === projId);
}
