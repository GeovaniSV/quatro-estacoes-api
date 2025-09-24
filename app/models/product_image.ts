import Product from './product.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class ProductImage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cloudinaryPublicId: string

  @column()
  declare productId: number

  @column()
  declare altText: string | null

  @column()
  declare sortOrder: number

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
