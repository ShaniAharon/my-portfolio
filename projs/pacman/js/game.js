'use strict';
const WALL = '🏢';
const FOOD = '🥚';
const EMPTY = ' ';
const POWER_FOOD = '🍔';
const CHERRY = '🍒';
const UP = '⏫';
const DOWN = '⏬';
const LEFT = '⏪';
const RIGHT = '⏩';
var gFoodCount = 57;
var gBoard;
var gGame = {
  score: 0,
  isOn: false,
};

function init() {
  gBoard = buildBoard();
  createPacman(gBoard);
  createGhosts(gBoard);
  printMat(gBoard, '.board-container');
  gGame.isOn = true;
}

function restartGame() {
  init();
  gGame.score = 0;
  gFoodCount = 57;

  var elModel = document.querySelector('.modal');
  elModel.style.display = 'none';
  updateScore(0);
  gFirstMove = true;
}

function buildBoard() {
  var SIZE = 10;
  var board = [];

  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD;
      if (
        i === 0 ||
        i === SIZE - 1 ||
        j === 0 ||
        j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)
      ) {
        board[i][j] = WALL;
      }
    }
  }

  board[1][1] = POWER_FOOD;
  board[1][8] = POWER_FOOD;
  board[8][1] = POWER_FOOD;
  board[8][8] = POWER_FOOD;

  return board;
}

function updateScore(diff) {
  gGame.score += diff;
  document.querySelector('h2 span').innerText = gGame.score;
}

function gameOver() {
  console.log('Game Over');
  gGame.isOn = false;
  showModalMessage(false);
  clearInterval(gIntervalGhosts);
  clearInterval(gCherryInterval);
}

function putCherry() {
  var emptyCoords = getEmptyLocations();
  var randCoord = emptyCoords[getRandomInt(0, emptyCoords.length)];

  gBoard[randCoord.i][randCoord.j] = CHERRY;
  renderCell(randCoord, CHERRY);
}

function getEmptyLocations() {
  var emptys = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j] === FOOD || gBoard[i][j] === EMPTY) {
        var emptyLocation = {i, j};
        emptys.push(emptyLocation);
      }
    }
  }
  return emptys;
}

function showModalMessage(isWin) {
  var elModel = document.querySelector('.modal');
  var elText = document.querySelector('.text');

  elModel.style.display = 'block';
  var message = isWin ? 'You Win!' : 'You Lost...';
  elText.innerText = message;
}

//57 foods
// function countFood() {
//   var countFood = 0;
//   for (var i = 0; i < gBoard.length; i++) {
//     for (var j = 0; j < gBoard[0].length; j++) {
//       if (gBoard[i][j] === FOOD || gBoard[i][j] === POWER_FOOD) {
//         countFood++;
//       }
//     }
//   }
//   return countFood;
// }
