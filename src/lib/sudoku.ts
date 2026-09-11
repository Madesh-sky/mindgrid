import { Difficulty, SudokuBoard } from '@/types';

export function isValidPlacement(board: SudokuBoard, row: number, col: number, num: number): boolean {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== row && board[i][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const currRow = startRow + i;
      const currCol = startCol + j;
      if ((currRow !== row || currCol !== col) && board[currRow][currCol] === num) return false;
    }
  }

  return true;
}

export function hasRuleConflict(board: SudokuBoard, row: number, col: number, num: number): boolean {
  return !isValidPlacement(board, row, col, num);
}

function solveBoard(board: SudokuBoard): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = nums.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nums[i], nums[j]] = [nums[j], nums[i]];
        }

        for (const num of nums) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (solveBoard(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generateSudoku(difficulty: Difficulty): { puzzle: SudokuBoard; solution: SudokuBoard } {
  const board: SudokuBoard = Array.from({ length: 9 }, () => Array(9).fill(null));
  
  solveBoard(board);
  const solution = board.map(row => [...row]);

  let cellsToRemove = 0;
  if (difficulty === 'easy') cellsToRemove = Math.floor(Math.random() * 5) + 38;
  else if (difficulty === 'medium') cellsToRemove = Math.floor(Math.random() * 5) + 46;
  else if (difficulty === 'hard') cellsToRemove = Math.floor(Math.random() * 5) + 53;

  const puzzle = solution.map(row => [...row]);
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      removed++;
    }
  }

  return { puzzle, solution };
}

export function isBoardComplete(userBoard: SudokuBoard, solution: SudokuBoard): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const val = userBoard[i][j];
      if (val === null) return false;
      if (!isValidPlacement(userBoard, i, j, val)) return false;
    }
  }
  return true;
}
