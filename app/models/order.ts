import Cart from '#models/cart'
import { DateTime } from 'luxon'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasOne(() => Cart)
  declare cart: HasOne<typeof Cart>

  @ApiProperty({ example: 16400 })
  @column()
  declare purchase_price: number

  @ApiProperty({ example: 'Cartão de Crédito' })
  @column()
  declare payment_method: number

  @column()
  declare price_view: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
