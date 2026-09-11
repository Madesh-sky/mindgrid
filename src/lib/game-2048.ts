import { Board2048, Direction } from '@/types';

export function createEmptyBoard(): Board2048 {
  return Array(4).fill(null).map(() => Array(4).fill(null));
}

export function addRandomTile(board: Board2048): Board2048 {
  const emptyCells: { r: number; c: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === null) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) return board;

  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  
  return newBoard;
}

export function initializeBoard(): Board2048 {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
}

function slideLeft(board: Board2048): { board: Board2048, score: number, moved: boolean } {
  let score = 0;
  let moved = false;
  const newBoard = createEmptyBoard();

  for (let r = 0; r < 4; r++) {
    const row = board[r];
    // Filter out nulls
    const filteredRow = row.filter(val => val !== null) as number[];
    const newRow: (number | null)[] = [];
    
    for (let c = 0; c < filteredRow.length; c++) {
      if (c < filteredRow.length - 1 && filteredRow[c] === filteredRow[c + 1]) {
        newRow.push(filteredRow[c] * 2);
        score += filteredRow[c] * 2;
        c++; // Skip next as it merged
      } else {
        newRow.push(filteredRow[c]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(null);
    }
    
    newBoard[r] = newRow;
    if (row.join(',') !== newRow.join(',')) {
      moved = true;
    }
  }

  return { board: newBoard, score, moved };
}

function rotateRight(board: Board2048): Board2048 {
  const newBoard = createEmptyBoard();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      newBoard[c][3 - r] = board[r][c];
    }
  }
  return newBoard;
}

export function move(board: Board2048, direction: Direction): { board: Board2048, score: number, moved: boolean } {
  let rotatedBoard = board;
  let rotations = 0;

  if (direction === 'up') rotations = 3;
  else if (direction === 'right') rotations = 2;
  else if (direction === 'down') rotations = 1;

  for (let i = 0; i < rotations; i++) {
    rotatedBoard = rotateRight(rotatedBoard);
  }

  const result = slideLeft(rotatedBoard);
  let finalBoard = result.board;

  // Rotate back
  const backRotations = (4 - rotations) % 4;
  for (let i = 0; i < backRotations; i++) {
    finalBoard = rotateRight(finalBoard);
  }

  return { board: finalBoard, score: result.score, moved: result.moved };
}

export function isGameOver(board: Board2048): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === null) return false;
      if (c < 3 && board[r][c] === board[r][c + 1]) return false;
      if (r < 3 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

export function hasWon(board: Board2048): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] !== null && board[r][c]! >= 2048) return true;
    }
  }
  return false;
}
