import mongoose from 'mongoose'
import { env } from './env.js'

export default async function connectDB() {
  await mongoose.connect(env.MONGO_URI)
  console.log('MongoDB connected')
}
