'use strict';

// Pieces Types
const KING_WHITE = '♔';
const QUEEN_WHITE = '♕';
const ROOK_WHITE = '♖';
const BISHOP_WHITE = '♗';
const KNIGHT_WHITE = '♘';
const PAWN_WHITE = '♙';
const KING_BLACK = '♚';
const QUEEN_BLACK = '♛';
const ROOK_BLACK = '♜';
const BISHOP_BLACK = '♝';
const KNIGHT_BLACK = '♞';
const PAWN_BLACK = '♟';
const gWhitePieces = ['♙', '♖', '♗', '♘', '♕', '♔'];

// The Chess Board
var gBoard;
var gSelectedElCell = null;

function restartGame() {
  gBoard = buildBoard();
  renderBoard(gBoard);
}

function buildBoard() {
  //build the board 8 * 8
  var board = [];
  for (var i = 0; i < 8; i++) {
    board[i] = [];
    for (var j = 0; j < 8; j++) {
      var piece = '';
      if (i === 1) piece = PAWN_BLACK;
      if (i === 6) piece = PAWN_WHITE;
      board[i][j] = piece;
    }
  }

  board[0][0] = board[0][7] = ROOK_BLACK;
  board[0][1] = board[0][6] = KNIGHT_BLACK;
  board[0][2] = board[0][5] = BISHOP_BLACK;
  board[0][3] = QUEEN_BLACK;
  board[0][4] = KING_BLACK;

  board[7][0] = board[7][7] = ROOK_WHITE;
  board[7][1] = board[7][6] = KNIGHT_WHITE;
  board[7][2] = board[7][5] = BISHOP_WHITE;
  board[7][3] = QUEEN_WHITE;
  board[7][4] = KING_WHITE;

  console.table(board);
  return board;
}

function renderBoard(board) {
  var strHtml = '';
  for (var i = 0; i < board.length; i++) {
    var row = board[i];
    strHtml += '<tr>';
    for (var j = 0; j < row.length; j++) {
      var cell = row[j];
      // figure class name
      var className = (i + j) % 2 === 0 ? 'white' : 'black';
      var tdId = `cell-${i}-${j}`;

      strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this)">
                            ${cell}
                        </td>`;
    }
    strHtml += '</tr>';
  }
  var elMat = document.querySelector('.game-board');
  elMat.innerHTML = strHtml;
}

function cellClicked(elCell) {
  // if the target is marked - move the piece!
  if (elCell.classList.contains('mark')) {
    movePiece(gSelectedElCell, elCell);
    cleanBoard();
    return;
  }

  cleanBoard();

  elCell.classList.add('selected');
  gSelectedElCell = elCell;

  // console.log('elCell.id: ', elCell.id);
  var cellCoord = getCellCoord(elCell.id);
  var piece = gBoard[cellCoord.i][cellCoord.j];

  var possibleCoords = [];
  switch (piece) {
    case ROOK_BLACK:
    case ROOK_WHITE:
      possibleCoords = getAllPossibleCoordsRook(cellCoord);
      break;
    case BISHOP_BLACK:
    case BISHOP_WHITE:
      possibleCoords = getAllPossibleCoordsBishop(cellCoord);
      break;
    case KNIGHT_BLACK:
    case KNIGHT_WHITE:
      possibleCoords = getAllPossibleCoordsKnight(cellCoord);
      break;
    case PAWN_BLACK:
    case PAWN_WHITE:
      possibleCoords = getAllPossibleCoordsPawn(
        cellCoord,
        piece === PAWN_WHITE
      );
      break;
    case KING_BLACK:
    case KING_WHITE:
      possibleCoords = getAllPossibleCoordsKing(cellCoord);
      break;
    case QUEEN_BLACK:
    case QUEEN_WHITE:
      possibleCoords = getAllPossibleCoordsQueen(cellCoord);
      break;
  }
  markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {
  var fromCoord = getCellCoord(elFromCell.id);
  var toCoord = getCellCoord(elToCell.id);

  // update the MODEL
  var piece = gBoard[fromCoord.i][fromCoord.j];
  gBoard[fromCoord.i][fromCoord.j] = '';
  gBoard[toCoord.i][toCoord.j] = piece;
  // update the DOM
  elFromCell.innerText = '';
  elToCell.innerText = piece;
}

function markCells(coords) {
  for (var i = 0; i < coords.length; i++) {
    var coord = coords[i];
    var elCell = document.querySelector(`#cell-${coord.i}-${coord.j}`);
    elCell.classList.add('mark');
  }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
  var parts = strCellId.split('-');
  var coord = {i: +parts[1], j: +parts[2]};
  return coord;
}

function cleanBoard() {
  var elTds = document.querySelectorAll('.mark, .selected');
  for (var i = 0; i < elTds.length; i++) {
    elTds[i].classList.remove('mark', 'selected');
  }
}

function getSelector(coord) {
  return '#cell-' + coord.i + '-' + coord.j;
}

function isEmptyCell(coord) {
  return gBoard[coord.i][coord.j] === '';
}

// function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
//   var res = [];

//   var diff = isWhite ? -1 : 1;
//   var nextCoord = {i: pieceCoord.i + diff, j: pieceCoord.j};
//   if (isEmptyCell(nextCoord)) res.push(nextCoord);
//   else return res;

//   if ((pieceCoord.i === 1 && !isWhite) || (pieceCoord.i === 6 && isWhite)) {
//     diff *= 2;
//     nextCoord = {i: pieceCoord.i + diff, j: pieceCoord.j};
//     if (isEmptyCell(nextCoord)) res.push(nextCoord);
//   }
//   return res;
// }

//improve pieces can eat
function getAllPossibleCoordsPawn(pieceCoord) {
  var possibleMoves = [];
  var currI = pieceCoord.i;
  var currJ = pieceCoord.j;
  var isWhitePiece = isWhite(pieceCoord);
  //TODO: if a pawn gets to the end of board make it a queen or rook or knight

  //top

  //white pawn
  if (pieceCoord.i === 6 && isWhitePiece) {
    var cellCoord = {i: --currI, j: currJ};
    var whiteBlocked = false;
    isEmptyCell(cellCoord)
      ? possibleMoves.push(cellCoord)
      : (whiteBlocked = true);
    cellCoord = {i: --currI, j: currJ};
    isEmptyCell(cellCoord) && !whiteBlocked
      ? possibleMoves.push(cellCoord)
      : false;
  } else if (isWhitePiece && pieceCoord.i) {
    cellCoord = {i: --currI, j: currJ};
    isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
  }
  //balck pawn
  if (pieceCoord.i === 1 && !isWhitePiece) {
    var cellCoord = {i: ++currI, j: currJ};
    var blackBlocked = false;
    isEmptyCell(cellCoord)
      ? possibleMoves.push(cellCoord)
      : (blackBlocked = true);
    cellCoord = {i: ++currI, j: currJ};
    isEmptyCell(cellCoord) && !blackBlocked
      ? possibleMoves.push(cellCoord)
      : false;
  } else if (!isWhitePiece && pieceCoord.i !== 7) {
    cellCoord = {i: ++currI, j: currJ};
    isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
  }

  currI = pieceCoord.i;
  currJ = pieceCoord.j;
  if (isWhitePiece) {
    if (currJ) {
      // not the end of board
      var cellCoordLeft = {i: --currI, j: --currJ}; //left diagnol
      if (!isEmptyCell(cellCoordLeft) && !isWhite(cellCoordLeft))
        possibleMoves.push(cellCoordLeft);
    }
    currI = pieceCoord.i;
    currJ = pieceCoord.j;
    if (currJ < 7) {
      // not the end of board
      var cellCoordRIght = {i: --currI, j: ++currJ}; //right diagnol
      if (!isEmptyCell(cellCoordRIght) && !isWhite(cellCoordRIght))
        possibleMoves.push(cellCoordRIght);
    }
  } else {
    // black piece
    if (currJ) {
      // not the end of board
      var cellCoordLeft = {i: ++currI, j: --currJ}; //bottom left diagnol
      if (!isEmptyCell(cellCoordLeft) && isWhite(cellCoordLeft))
        possibleMoves.push(cellCoordLeft);
    }
    currI = pieceCoord.i;
    currJ = pieceCoord.j;
    if (currJ < 7) {
      // not the end of board
      var cellCoordRIght = {i: ++currI, j: ++currJ}; //right diagnol
      if (!isEmptyCell(cellCoordRIght) && isWhite(cellCoordRIght))
        possibleMoves.push(cellCoordRIght);
    }
  }

  return possibleMoves;
}

function getAllPossibleCoordsRook(pieceCoord) {
  var res = [];
  var maxLength = gBoard[pieceCoord.i].length;
  var isWhitePiece = isWhite(pieceCoord);
  //top
  for (var idx = pieceCoord.i - 1; idx >= 0; idx--) {
    var colCell = {i: idx, j: pieceCoord.j};
    //if white piece can move and eat black piece
    // else if black piece can move and eat white
    if (isWhitePiece) {
      if (!isEmptyCell(colCell) && !isWhite(colCell)) res.push(colCell);
    } else {
      if (!isEmptyCell(colCell) && isWhite(colCell)) res.push(colCell);
    }
    if (!isEmptyCell(colCell)) break;
    res.push(colCell);
  }
  //bottom
  for (var idx = pieceCoord.i + 1; idx < maxLength; idx++) {
    var colCell = {i: idx, j: pieceCoord.j};
    //if white piece can move and eat black piece
    // else if black piece can move and eat white
    if (isWhitePiece) {
      if (!isEmptyCell(colCell) && !isWhite(colCell)) res.push(colCell);
    } else {
      if (!isEmptyCell(colCell) && isWhite(colCell)) res.push(colCell);
    }
    if (!isEmptyCell(colCell)) break;
    res.push(colCell);
  }
  //right
  for (var idx = pieceCoord.j + 1; idx < maxLength; idx++) {
    var rowCell = {i: pieceCoord.i, j: idx};
    //if white piece can move and eat black piece
    // else if black piece can move and eat white
    if (isWhitePiece) {
      if (!isEmptyCell(rowCell) && !isWhite(rowCell)) res.push(rowCell);
    } else {
      if (!isEmptyCell(rowCell) && isWhite(rowCell)) res.push(rowCell);
    }
    if (!isEmptyCell(rowCell)) break;
    res.push(rowCell);
  }
  //left
  for (var idx = pieceCoord.j - 1; idx >= 0; idx--) {
    var rowCell = {i: pieceCoord.i, j: idx};
    //if white piece can move and eat black piece
    // else if black piece can move and eat white
    if (isWhitePiece) {
      if (!isEmptyCell(rowCell) && !isWhite(rowCell)) res.push(rowCell);
    } else {
      if (!isEmptyCell(rowCell) && isWhite(rowCell)) res.push(rowCell);
    }
    if (!isEmptyCell(rowCell)) break;
    res.push(rowCell);
  }
  return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
  var res = [];
  var maxLength = gBoard[pieceCoord.i].length;
  var currI = 0;
  var currJ = 0;
  var isWhitePiece = isWhite(pieceCoord);

  // top right
  currI = pieceCoord.i - 1;
  currJ = pieceCoord.j + 1;
  for (var idx = pieceCoord.j + 1; idx < maxLength; idx++) {
    var topRightDiagnolCell = {i: currI--, j: currJ++};
    if (topRightDiagnolCell.i < 0 || topRightDiagnolCell.j < 0) break;
    //check if its white piece and allow to move to black piece and eat
    //same for black piece
    if (isWhitePiece) {
      if (!isEmptyCell(topRightDiagnolCell) && !isWhite(topRightDiagnolCell))
        res.push(topRightDiagnolCell);
    } else {
      if (!isEmptyCell(topRightDiagnolCell) && isWhite(topRightDiagnolCell))
        res.push(topRightDiagnolCell);
    }
    if (!isEmptyCell(topRightDiagnolCell)) break;
    res.push(topRightDiagnolCell);
  }

  // top left
  currI = pieceCoord.i - 1;
  currJ = pieceCoord.j - 1;
  for (var idx = pieceCoord.j - 1; idx >= 0; idx--) {
    var topLeftDiagnolCell = {i: currI--, j: currJ--};
    if (topLeftDiagnolCell.i < 0 || topLeftDiagnolCell.j < 0) break;
    //check if its white piece and allow to move to black piece and eat
    if (isWhitePiece) {
      if (!isEmptyCell(topLeftDiagnolCell) && !isWhite(topLeftDiagnolCell))
        res.push(topLeftDiagnolCell);
    } else {
      if (!isEmptyCell(topLeftDiagnolCell) && isWhite(topLeftDiagnolCell))
        res.push(topLeftDiagnolCell);
    }
    if (!isEmptyCell(topLeftDiagnolCell)) break;
    res.push(topLeftDiagnolCell);
  }

  // bottom right
  currI = pieceCoord.i + 1;
  currJ = pieceCoord.j + 1;
  var downDis = 7 - pieceCoord.i;
  var rightDis = 7 - pieceCoord.j;
  var distance = downDis < rightDis ? downDis : rightDis;
  for (var idx = 0; idx < distance; idx++) {
    var bottomRightDiagnolCell = {i: currI++, j: currJ++};
    if (bottomRightDiagnolCell.i < 0 || bottomRightDiagnolCell.j < 0) break;
    //check if its white piece and allow to move to black piece and eat
    //same for black piece
    if (isWhitePiece) {
      if (
        !isEmptyCell(bottomRightDiagnolCell) &&
        !isWhite(bottomRightDiagnolCell)
      )
        res.push(bottomRightDiagnolCell);
    } else {
      if (
        !isEmptyCell(bottomRightDiagnolCell) &&
        isWhite(bottomRightDiagnolCell)
      )
        res.push(bottomRightDiagnolCell);
    }
    if (!isEmptyCell(bottomRightDiagnolCell)) break;
    res.push(bottomRightDiagnolCell);
  }

  // bottom left
  currI = pieceCoord.i + 1;
  currJ = pieceCoord.j - 1;
  var downDis = 7 - pieceCoord.i;
  var distance = downDis < pieceCoord.j ? downDis : pieceCoord.j;
  for (var idx = 0; idx < distance; idx++) {
    var bottomLeftDiagnolCell = {i: currI++, j: currJ--};
    if (bottomLeftDiagnolCell.i < 0 || bottomLeftDiagnolCell.j < 0) break;
    //check if its white piece and allow to move to black piece and eat
    //same for black piece
    if (isWhitePiece) {
      if (
        !isEmptyCell(bottomLeftDiagnolCell) &&
        !isWhite(bottomLeftDiagnolCell)
      )
        res.push(bottomLeftDiagnolCell);
    } else {
      if (!isEmptyCell(bottomLeftDiagnolCell) && isWhite(bottomLeftDiagnolCell))
        res.push(bottomLeftDiagnolCell);
    }
    if (!isEmptyCell(bottomLeftDiagnolCell)) break;
    res.push(bottomLeftDiagnolCell);
  }

  return res;
}

function getAllPossibleCoordsKnight(pieceCoord) {
  var possibleMoves = [];
  var isWhitePiece = isWhite(pieceCoord);
  var currI = pieceCoord.i - 2;
  var currJ = pieceCoord.j - 1;
  //top
  if (pieceCoord.i > 1) {
    var cellCoord = {i: currI, j: currJ};
    // top left
    if (pieceCoord.j) {
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
    //top right
    if (pieceCoord.j !== 7) {
      cellCoord = {i: currI, j: (currJ += 2)};
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
  }

  //bottom
  currI = pieceCoord.i + 2;
  currJ = pieceCoord.j - 1;
  if (pieceCoord.i < 6) {
    var cellCoord = {i: currI, j: currJ};
    // bottom left
    if (pieceCoord.j) {
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
    // bottom right
    if (pieceCoord.j !== 7) {
      cellCoord = {i: currI, j: (currJ += 2)};
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
  }

  //right
  currI = pieceCoord.i + 1;
  currJ = pieceCoord.j + 2;
  if (pieceCoord.j < 6) {
    var cellCoord = {i: currI, j: currJ};
    //right bottom
    if (pieceCoord.i !== 7) {
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
    //right top
    if (pieceCoord.i) {
      cellCoord = {i: (currI -= 2), j: currJ};
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
  }

  //left
  currI = pieceCoord.i + 1;
  currJ = pieceCoord.j - 2;
  if (pieceCoord.j > 1) {
    var cellCoord = {i: currI, j: currJ};
    //left bottom
    if (pieceCoord.i !== 7) {
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
    //left top
    if (pieceCoord.i) {
      cellCoord = {i: (currI -= 2), j: currJ};
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
  }

  return possibleMoves;
}

function getAllPossibleCoordsKing(pieceCoord) {
  var possibleMoves = [];
  var currI = pieceCoord.i - 1;
  var currJ = pieceCoord.j - 1;
  //TODO: make a  way to eat white pieces or black
  //TODO: castle
  //TODO: check ditiction
  //top
  if (pieceCoord.i) {
    for (var j = 0; j < 3; j++) {
      var cellCoord = {i: currI, j: currJ++};
      if (!isEmptyCell(cellCoord)) continue;
      possibleMoves.push(cellCoord);
    }
  }

  //middle
  currI = pieceCoord.i;
  currJ = pieceCoord.j - 1;
  for (var j = 0; j < 3; j++) {
    var cellCoord = {i: currI, j: currJ++};
    if (!isEmptyCell(cellCoord)) continue;
    possibleMoves.push(cellCoord);
  }

  //bottom
  currI = pieceCoord.i + 1;
  currJ = pieceCoord.j - 1;
  if (pieceCoord.i !== 7) {
    for (var j = 0; j < 3; j++) {
      var cellCoord = {i: currI, j: currJ++};
      if (!isEmptyCell(cellCoord)) continue;
      possibleMoves.push(cellCoord);
    }
  }
  return possibleMoves;
}

function getAllPossibleCoordsQueen(pieceCoord) {
  var possibleMoves = [
    ...getAllPossibleCoordsRook(pieceCoord),
    ...getAllPossibleCoordsBishop(pieceCoord),
  ];
  return possibleMoves;
}

//check if cell is white piece
function isWhite(pieceCoord) {
  var piece = gBoard[pieceCoord.i][pieceCoord.j];
  for (var i = 0; i < gWhitePieces.length; i++) {
    if (piece === gWhitePieces[i]) {
      return true;
    }
  }
  return false;
}
