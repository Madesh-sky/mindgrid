import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GameResult from '@/models/GameResult';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const game = searchParams.get('game');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let leaderboard: any[] = [];

    if (!game || game === 'all') {
      const g2048 = await GameResult.find({ game: '2048' }).sort({ score: -1 }).limit(10);
      const sudoku = await GameResult.find({ game: 'sudoku', time: { $exists: true } }).sort({ time: 1 }).limit(10);
      const puzzle15 = await GameResult.find({ game: '15-puzzle', moves: { $exists: true } }).sort({ moves: 1, time: 1 }).limit(10);
      const puzzle24 = await GameResult.find({ game: '24-puzzle', moves: { $exists: true } }).sort({ moves: 1, time: 1 }).limit(10);
      const puzzle35 = await GameResult.find({ game: '35-puzzle', moves: { $exists: true } }).sort({ moves: 1, time: 1 }).limit(10);
      const xo = await GameResult.find({ game: { $in: ['xo', 'ultimate-xo', 'XO'] } }).sort({ createdAt: -1 }).limit(10);
      leaderboard = [...g2048, ...sudoku, ...puzzle15, ...puzzle24, ...puzzle35, ...xo];
    } else if (game === '2048') {
      leaderboard = await GameResult.find({ game: '2048' }).sort({ score: -1 }).limit(20);
    } else if (game === 'sudoku') {
      leaderboard = await GameResult.find({ game: 'sudoku', time: { $exists: true } }).sort({ time: 1 }).limit(20);
    } else if (game === '15-puzzle') {
      leaderboard = await GameResult.find({ game: '15-puzzle', moves: { $exists: true } }).sort({ moves: 1, time: 1 }).limit(20);
    } else if (game === '24-puzzle') {
      leaderboard = await GameResult.find({ game: '24-puzzle', moves: { $exists: true } }).sort({ moves: 1, time: 1 }).limit(20);
    } else if (game === '35-puzzle') {
      leaderboard = await GameResult.find({ game: '35-puzzle', moves: { $exists: true } }).sort({ moves: 1, time: 1 }).limit(20);
    } else if (game === 'xo') {
      leaderboard = await GameResult.find({ game: { $in: ['xo', 'ultimate-xo', 'XO'] } }).sort({ createdAt: -1 }).limit(20);
    }

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.warn('MongoDB connection not available in GET /api/leaderboard:', error);
    return NextResponse.json({ leaderboard: [], offline: true });
  }
}
