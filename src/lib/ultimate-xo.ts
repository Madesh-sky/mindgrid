import { UltimateXOState, SmallBoardState, SmallBoardWinner, XOPlayer } from '@/types';

export function createInitialState(): UltimateXOState {
  return {
    boards: Array.from({ length: 9 }, () => Array(9).fill(null)),
    boardWinners: Array(9).fill(null),
    currentPlayer: 'X',
    activeBoard: null,
    moveCount: 0,
    overallWinner: null,
    gameOver: false,
  };
}

export function checkSmallBoardWinner(board: SmallBoardState): SmallBoardWinner {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as SmallBoardWinner;
    }
  }

  if (board.every(cell => cell !== null)) {
    return 'draw';
  }

  return null;
}

export function checkOverallWinner(boardWinners: SmallBoardWinner[]): XOPlayer | 'draw' | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (
      boardWinners[a] &&
      (boardWinners[a] === 'X' || boardWinners[a] === 'O') &&
      boardWinners[a] === boardWinners[b] &&
      boardWinners[a] === boardWinners[c]
    ) {
      return boardWinners[a] as XOPlayer;
    }
  }

  if (boardWinners.every(winner => winner !== null)) {
    const xCount = boardWinners.filter(w => w === 'X').length;
    const oCount = boardWinners.filter(w => w === 'O').length;
    if (xCount > oCount) return 'X';
    if (oCount > xCount) return 'O';
    return 'draw';
  }

  return null;
}

export function getPlayableBoards(state: UltimateXOState): number[] {
  if (state.gameOver) return [];

  const playable: number[] = [];

  if (
    state.activeBoard !== null &&
    state.boardWinners[state.activeBoard] === null &&
    state.boards[state.activeBoard].some(cell => cell === null)
  ) {
    return [state.activeBoard];
  }

  for (let i = 0; i < 9; i++) {
    if (state.boardWinners[i] === null && state.boards[i].some(cell => cell === null)) {
      playable.push(i);
    }
  }

  return playable;
}

export function makeMove(state: UltimateXOState, boardIdx: number, cellIdx: number): UltimateXOState | null {
  if (state.gameOver) return null;

  const playableBoards = getPlayableBoards(state);
  if (!playableBoards.includes(boardIdx)) return null;
  if (state.boards[boardIdx][cellIdx] !== null) return null;

  const newBoards = [...state.boards];
  const newBoard = [...newBoards[boardIdx]];
  newBoard[cellIdx] = state.currentPlayer;
  newBoards[boardIdx] = newBoard;

  const newBoardWinners = [...state.boardWinners];
  const smallWinner = checkSmallBoardWinner(newBoard);
  if (smallWinner) {
    newBoardWinners[boardIdx] = smallWinner;
  }

  const overallWinner = checkOverallWinner(newBoardWinners);
  const gameOver = overallWinner !== null;

  let nextActiveBoard: number | null = cellIdx;
  if (newBoardWinners[nextActiveBoard] !== null || !newBoards[nextActiveBoard].some(c => c === null)) {
    nextActiveBoard = null;
  }

  return {
    boards: newBoards,
    boardWinners: newBoardWinners,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    activeBoard: gameOver ? null : nextActiveBoard,
    moveCount: state.moveCount + 1,
    overallWinner,
    gameOver,
  };
}
