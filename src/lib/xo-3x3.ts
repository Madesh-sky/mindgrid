export type XOPlayer = 'X' | 'O';
export type XOCell = XOPlayer | null;

export interface XO3x3State {
  board: XOCell[];
  currentPlayer: XOPlayer;
  winner: XOPlayer | 'draw' | null;
  moveCount: number;
  gameOver: boolean;
}

export function createInitial3x3State(): XO3x3State {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    moveCount: 0,
    gameOver: false,
  };
}

export function checkWinner3x3(board: XOCell[]): XOPlayer | 'draw' | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as XOPlayer;
    }
  }

  if (board.every(cell => cell !== null)) {
    return 'draw';
  }

  return null;
}

export function getWinningLine3x3(board: XOCell[]): number[] | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}

export function makeMove3x3(state: XO3x3State, cellIdx: number): XO3x3State | null {
  if (state.gameOver || state.board[cellIdx] !== null) {
    return null;
  }

  const newBoard = [...state.board];
  newBoard[cellIdx] = state.currentPlayer;

  const winner = checkWinner3x3(newBoard);
  
  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    winner,
    moveCount: state.moveCount + 1,
    gameOver: winner !== null,
  };
}
