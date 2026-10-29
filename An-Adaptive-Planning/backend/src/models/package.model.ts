import { Model, Schema, Types, model } from 'mongoose'

export type PackageCategory = 'Parties' | 'Moving' | 'Trips' | 'Other'
export type PackageStatus = 'pending' | 'approved' | 'suspended' | 'rejected'

export interface IPackage {
  provider: Types.ObjectId
  title: string
  category: PackageCategory
  price: number
  duration?: string
  description?: string
  image?: string
  status: PackageStatus // set by admin
  isActive: boolean // the provider's on/off switch
  rating: number
}
interface PackageModel extends Model<IPackage> {
  publicFilter(category?: string): Record<string, unknown>
}

const schema = new Schema<IPackage, PackageModel>({
  provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Parties', 'Moving', 'Trips', 'Other'], default: 'Other' },
  price: { type: Number, required: true, min: 0 },
  duration: String,
  description: String,
  image: String,
  status: { type: String, enum: ['pending', 'approved', 'suspended', 'rejected'], default: 'pending' },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
}, { timestamps: true })

schema.statics.publicFilter = (category?: string) => ({ status: 'approved', isActive: true, ...(category && category !== 'All' ? { category } : {}) })

export default model<IPackage, PackageModel>('Package', schema)
