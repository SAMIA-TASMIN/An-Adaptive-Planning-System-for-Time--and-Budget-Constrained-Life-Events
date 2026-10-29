import { Schema, model } from 'mongoose'
const schema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    title: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['must', 'should', 'nice'], default: 'should' },
    assignee: String,
    due: Date,
    column: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    confirmed: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default model('Task', schema)
