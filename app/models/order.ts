import OrderItem from './order_item.js'
import Payment from './payment.js'
import User from './user.js'
import { DateTime } from 'luxon'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'

export default class Order extends BaseModel {
  @ApiProperty()
  @column({ isPrimary: true })
  declare id: number

  @ApiProperty({
    example: 90000,
  })
  @column()
  declare purchase_price: number

  @ApiProperty({ example: '900,00' })
  @column()
  declare price_view: string

  @ApiProperty({ example: 'em andamento' })
  @column()
  declare status: 'em andamento' | 'finalizado'

  @ApiProperty({ example: 1 })
  @column()
  declare userId: number

  @ApiProperty({ example: 1 })
  @column()
  declare paymentId: number

  @belongsTo(() => Payment)
  declare payment: BelongsTo<typeof Payment>

  @hasMany(() => OrderItem)
  declare OrderItems: HasMany<typeof OrderItem>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
