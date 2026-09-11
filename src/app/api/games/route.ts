import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GameResult from '@/models/GameResult';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const game = searchParams.get('game');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (game && game !== 'all') {
      if (game === 'xo') {
        query.game = { $in: ['xo', 'ultimate-xo', 'XO'] };
      } else {
        query.game = game;
      }
    }
    
    const results = await GameResult.find(query).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ results });
  } catch (error) {
    console.warn('MongoDB connection not available in GET /api/games:', error);
    return NextResponse.json({ results: [], offline: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();
    const newResult = new GameResult(body);
    const savedDoc = await newResult.save();
    return NextResponse.json({ result: savedDoc }, { status: 201 });
  } catch (error) {
    console.warn('MongoDB connection not available in POST /api/games (stored on client):', error);
    return NextResponse.json({ result: null, offline: true });
  }
}
