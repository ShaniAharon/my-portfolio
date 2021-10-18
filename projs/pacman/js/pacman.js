'use strict';
var PACMAN = '😷';
var gEatenGhosts = [];
var gCherryInterval;
var gFirstMove = true;

var gPacman;
function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5,
    },
    isSuper: false,
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}
function movePacman(ev) {
  if (!gGame.isOn) return;
  // console.log('ev', ev);
  if (gFirstMove) {
    gFirstMove = false;
    gCherryInterval = setInterval(putCherry, 15000);
  }
  var nextLocation = getNextLocation(ev);

  if (!nextLocation) return;
  // console.log('nextLocation', nextLocation);

  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  // console.log('NEXT CELL', nextCell);

  if (nextCell === WALL) return;
  if (nextCell === FOOD) {
    gFoodCount--;
    //check if win
    isWinGame(gFoodCount);
    updateScore(1);
  }
  if (nextCell === CHERRY) updateScore(10);

  if (nextCell === POWER_FOOD) {
    if (gPacman.isSuper) return;
    gFoodCount--;
    //check if win
    isWinGame(gFoodCount);
    gPacman.isSuper = true;
    setTimeout(setToNormal, 5000);
  }
  if (nextCell === GHOST) {
    if (!gPacman.isSuper) {
      gameOver();
      renderCell(gPacman.location, EMPTY);
      return;
    } else {
      var ghost = getGhostByLocation(nextLocation);
      eatGhost(ghost);
    }
  }

  // update the model
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;

  // update the dom
  renderCell(gPacman.location, EMPTY);

  gPacman.location = nextLocation;

  // update the model
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // update the dom
  renderCell(gPacman.location, PACMAN);
}

function getNextLocation(eventKeyboard) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j,
  };
  switch (eventKeyboard.code) {
    case 'ArrowUp':
      nextLocation.i--;
      PACMAN = UP;
      break;
    case 'ArrowDown':
      nextLocation.i++;
      PACMAN = DOWN;
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      PACMAN = LEFT;
      break;
    case 'ArrowRight':
      nextLocation.j++;
      PACMAN = RIGHT;
      break;
    default:
      return null;
  }
  return nextLocation;
}

function eatGhost(ghost) {
  ghost.location.i = 3;
  ghost.location.j = 3;
  gEatenGhosts.push(ghost);
}

function showEatenGhosts() {
  while (gEatenGhosts.length) {
    gGhosts.push(gEatenGhosts.pop());
  }
}

function setToNormal() {
  gPacman.isSuper = false;
  showEatenGhosts();
}

function isWinGame(foodCount) {
  if (!foodCount) {
    gGame.isOn = false;
    showModalMessage(true);
    clearInterval(gIntervalGhosts);
    clearInterval(gCherryInterval);
  }
}
