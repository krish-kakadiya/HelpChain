import mongoose from 'mongoose';

const expertSessionSchema = new mongoose.Schema({
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coinsCost: Number,
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  assignedAt: { type: Date, default: Date.now },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('ExpertSession', expertSessionSchema);
