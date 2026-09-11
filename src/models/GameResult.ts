import mongoose from 'mongoose';

const GameResultSchema = new mongoose.Schema({
  playerName: { type: String },
  playerX: { type: String },
  playerO: { type: String },
  game: { type: String, required: true },
  gameMode: { type: String },
  score: { type: Number },
  result: { type: String, required: true },
  moves: { type: Number },
  time: { type: Number },
  difficulty: { type: String },
  mistakes: { type: Number },
}, { timestamps: true });

export default mongoose.models.GameResult || mongoose.model('GameResult', GameResultSchema);
