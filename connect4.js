/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(color) {
    this.color = color; // set the players color
  }
}

class Game {
  constructor(p1, p2, height=6, width=7) {
      this.players = [p1, p2]; // array to store the 2 players
      this.curPlayer = p1; // set current player to plater 13
      this.height = height;
      this.width = width;
      this.board = []; // intitialize the board
      this.gameOver = false; // initalize gameover to false
      this.makeBoard(); // create board data structure
      this.makeHtmlBoard(); // create html representation of board
      this.startGame(); // start a new game 
    }
  



/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }


/** makeHtmlBoard: make HTML table and row of column tops. */

makeHtmlBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', this.handleClick.bind(this)); // Bind the context of `this` to the Game instance

  for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);

  // make main part of board
  for (let y = 0; y < this.height; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

findSpotForCol(x) {
  for (let y = this.height - 1; y >= 0; y--) {
    if (!this.board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.style.backgroundColor = this.curPlayer.color;
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

endGame(msg) {
  alert(msg);
  this.gameOver = true;  // Set the gameOver flag to true
}

/** handleClick: handle click of column top to play piece */

handleClick(evt) {
  if (this.gameOver) return;  // Ignore clicks if the game is over
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  this.board[y][x] = this.curPlayer;  // Update the board data structure
  this.placeInTable(y, x); // Update the HTML table
  
  // check for win
  if (this.checkForWin()) {
    // +1 is used to convert the zero-based index of the current player to a one-based player number.
      const winner = this.players.indexOf(this.curPlayer) + 1; // Determine the winner's number (1 or 2)

      return this.endGame(`Player ${winner} won!`); // announce the winner
    }
  
  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }
    
  // switch players
  this.curPlayer = this.curPlayer === this.players[0] ? this.players[1] : this.players[0]; 
   // switch to the other player with ternary operator
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

checkForWin() {
  // Helper function to check for a win
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.curPlayer
    );
  };

  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true; // return true if there is a winning combination.
      }
    }
  }
}


startGame() {
  this.board = []; // reset the board
  this.makeBoard(); // create new board structure
  this.makeHtmlBoard(); // create new board structure
  this.gameOver = false; // create a new HTML representation of the board.
  this.curPlayer = this.players[0]; // reset to player 1. 
  }
}


// create new game instance
const game = new Game(new Player('#ff0000'), new Player('#ffff00')); // create game instance with two plater with specified colors. 


// add button to start/restart game 
document.getElementById('start-btn').addEventListener('click', () => {
// create new player instances with colors from input fields
let p1 = new Player(document.getElementById('p1-color').value);
let p2 = new Player(document.getElementById('p2-color').value);
// start new game with selected player colors
new Game(p1, p2);
}); 



// Notes to self: 
// able to remove function keyword because they are all methods within the game class
// 