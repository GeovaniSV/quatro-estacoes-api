import Product from '#models/product'
import { DateTime } from 'luxon'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasOne(() => Product)
  declare product: HasOne<typeof Product>

  @column()
  declare product_quantity: number

  @column()
  declare product_color: string

  @column()
  declare product_unit_price: number

  @column()
  declare item_price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
