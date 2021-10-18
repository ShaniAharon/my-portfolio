'use strict';
const GHOST = '&#9781;';
const ANGEL = '😇';
var gCustoms = [];
var gGhosts = [];
var gIntervalGhosts;

function createGhost(board) {
  var ghost = {
    location: {
      i: 3,
      j: 3,
    },
    currCellContent: FOOD,
    // colorHtml: getGhostHTML(ghost), // for random color ghost
    //improve style ghost icon
    colorHtml: gCustoms.pop(),
    eatableLook: ANGEL,
  };

  gGhosts.push(ghost);
  board[ghost.location.i][ghost.location.j] = GHOST;
}

function createGhosts(board) {
  gGhosts = [];
  gCustoms = ['😈', '👽', '🐱‍👤'];
  createGhost(board);
  createGhost(board);
  createGhost(board);
  gIntervalGhosts = setInterval(moveGhosts, 1000);
}

function moveGhosts() {
  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i];
    moveGhost(ghost);
  }
}
function moveGhost(ghost) {
  var moveDiff = getMoveDiff();
  var nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  };
  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  if (nextCell === WALL) return;
  if (nextCell === GHOST) return;
  if (nextCell === PACMAN && gPacman.isSuper) return;
  if (nextCell === PACMAN && !gPacman.isSuper) {
    gameOver();
    return;
  }

  // model
  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
  // dom
  renderCell(ghost.location, ghost.currCellContent);

  // model
  ghost.location = nextLocation;
  ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j];
  gBoard[ghost.location.i][ghost.location.j] = GHOST;
  // dom
  var ghostLook = gPacman.isSuper ? ghost.eatableLook : ghost.colorHtml;
  renderCell(ghost.location, ghostLook);
}

function getMoveDiff() {
  var randNum = getRandomInt(0, 100);
  if (randNum < 25) {
    return {i: 0, j: 1};
  } else if (randNum < 50) {
    return {i: -1, j: 0};
  } else if (randNum < 75) {
    return {i: 0, j: -1};
  } else {
    return {i: 1, j: 0};
  }
}

function getGhostHTML(ghost) {
  return `<span style="color: ${getRandomColor()}">${GHOST}</span>`;
}

//change name kill ghost
function getGhostByLocation(location) {
  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i];
    if (ghost.location.i === location.i && ghost.location.j === location.j) {
      return gGhosts.splice(i, 1)[0]; // splice return an array
    }
  }
  return;
}
