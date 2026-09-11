export function createSolvedBoard(size: number): number[] {
  const total = size * size;
  const board = [];
  for (let i = 1; i < total; i++) {
    board.push(i);
  }
  board.push(0);
  return board;
}

export function canMove(tiles: number[], index: number, size: number): boolean {
  const emptyIndex = tiles.indexOf(0);
  
  const row = Math.floor(index / size);
  const col = index % size;
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;

  const isAdjacentRow = row === emptyRow && Math.abs(col - emptyCol) === 1;
  const isAdjacentCol = col === emptyCol && Math.abs(row - emptyRow) === 1;

  return isAdjacentRow || isAdjacentCol;
}

export function moveTile(tiles: number[], index: number, size: number): number[] {
  if (!canMove(tiles, index, size)) return tiles;

  const emptyIndex = tiles.indexOf(0);
  const newTiles = [...tiles];
  
  // Swap
  newTiles[emptyIndex] = newTiles[index];
  newTiles[index] = 0;
  
  return newTiles;
}

export function shuffleBoard(size: number): number[] {
  let currentBoard = createSolvedBoard(size);
  let emptyIndex = size * size - 1;
  
  // Make random valid moves to ensure it's well shuffled but solvable
  for (let i = 0; i < 350; i++) {
    const validMoves = [];
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    
    // Check neighbors
    if (emptyRow > 0) validMoves.push(emptyIndex - size); // Up
    if (emptyRow < size - 1) validMoves.push(emptyIndex + size); // Down
    if (emptyCol > 0) validMoves.push(emptyIndex - 1); // Left
    if (emptyCol < size - 1) validMoves.push(emptyIndex + 1); // Right
    
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    currentBoard = moveTile(currentBoard, randomMove, size);
    emptyIndex = currentBoard.indexOf(0);
  }
  
  return currentBoard;
}

export function isSolved(tiles: number[], size: number): boolean {
  const solved = createSolvedBoard(size);
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] !== solved[i]) return false;
  }
  return true;
}
