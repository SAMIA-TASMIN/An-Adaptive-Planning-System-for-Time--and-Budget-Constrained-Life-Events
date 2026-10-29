import { Schema, Types, model } from 'mongoose'

export interface ITask {
  event: Types.ObjectId
  title: string
  priority: 'must' | 'should' | 'nice'
  assignee?: string
  due?: Date
  column: 'todo' | 'in_progress' | 'done'
  confirmed: boolean
}

const schema = new Schema<ITask>({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: true, trim: true },
  priority: { type: String, enum: ['must', 'should', 'nice'], default: 'should' },
  assignee: String,
  due: Date,
  column: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  confirmed: { type: Boolean, default: false },
}, { timestamps: true })

export default model<ITask>('Task', schema)
