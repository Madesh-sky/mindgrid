// ============================================================
// Game Types
// ============================================================

export type GameType = string;
export type Difficulty = 'easy' | 'medium' | 'hard';

// ============================================================
// Game Result (stored in MongoDB)
// ============================================================

export interface GameResultData {
  _id?: string;
  playerName?: string;
  playerX?: string;
  playerO?: string;
  game: string;
  gameMode?: string;
  score?: number;
  result: string; // 'win', 'lose', 'draw', 'completed', 'X wins', 'O wins'
  moves?: number;
  time?: number; // seconds
  difficulty?: string;
  mistakes?: number;
  createdAt?: string;
}

// ============================================================
// Leaderboard
// ============================================================

export interface LeaderboardEntry {
  _id?: string;
  playerName: string;
  playerX?: string;
  playerO?: string;
  game: string;
  gameMode?: string;
  score?: number;
  result: string;
  moves?: number;
  time?: number;
  difficulty?: string;
  createdAt?: string;
}

// ============================================================
// Sudoku
// ============================================================

export type SudokuBoard = (number | null)[][];

export interface SudokuState {
  puzzle: SudokuBoard;
  solution: SudokuBoard;
  userBoard: SudokuBoard;
  selectedCell: { row: number; col: number } | null;
  mistakes: number;
  isComplete: boolean;
  difficulty: Difficulty;
}

// ============================================================
// Ultimate Tic-Tac-Toe
// ============================================================

export type XOPlayer = 'X' | 'O';
export type XOCell = XOPlayer | null;
export type SmallBoardState = XOCell[];
export type SmallBoardWinner = XOPlayer | 'draw' | null;

export interface UltimateXOState {
  boards: SmallBoardState[];       // 9 small boards, each with 9 cells
  boardWinners: SmallBoardWinner[]; // winner of each small board
  currentPlayer: XOPlayer;
  activeBoard: number | null;       // which small board must be played in (null = free choice)
  moveCount: number;
  overallWinner: XOPlayer | 'draw' | null;
  gameOver: boolean;
}

// ============================================================
// 2048
// ============================================================

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Tile2048 {
  value: number;
  id: number;
}

export type Board2048 = (number | null)[][];

export interface Game2048State {
  board: Board2048;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}

// ============================================================
// Sliding Puzzle
// ============================================================

export type PuzzleTiles = number[]; // N elements, 0 = empty

export interface PuzzleState {
  tiles: PuzzleTiles;
  moves: number;
  isSolved: boolean;
}

// ============================================================
// Component Props
// ============================================================

export interface GameCardProps {
  title: string;
  description: string;
  difficulty?: string;
  icon: string;
  href: string;
  accentColor: string;
}

export interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (seconds: number) => void;
  reset?: boolean;
}

export interface ScoreBoardItem {
  label: string;
  value: string | number;
}

export interface GameResultProps {
  show: boolean;
  title: string;
  stats: ScoreBoardItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (playerInfo: any) => void;
  onPlayAgain: () => void;
  onClose?: () => void;
  playerNameLabel?: string;
  showPlayerX?: boolean;
  defaultPlayerName?: string;
  defaultPlayerX?: string;
  defaultPlayerO?: string;
}
