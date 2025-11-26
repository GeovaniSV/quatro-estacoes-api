import OrderItem from './order_item.js'
import Payment from './payment.js'
import User from './user.js'
import { DateTime } from 'luxon'
import type { HasMany, HasOne, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany, hasOne, belongsTo } from '@adonisjs/lucid/orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare purchase_price: number

  @column()
  declare price_view: string

  @column()
  declare status: 'em andamento' | 'finalizado'

  @column()
  declare userId: number

  @column()
  declare paymentId: number

  @hasOne(() => Payment)
  declare payment: HasOne<typeof Payment>

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
