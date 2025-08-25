import Cart from '#models/cart'
import { DateTime } from 'luxon'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasOne(() => Cart)
  declare cart: HasOne<typeof Cart>

  @column()
  declare purchase_price: number

  @column()
  declare payment_method: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
