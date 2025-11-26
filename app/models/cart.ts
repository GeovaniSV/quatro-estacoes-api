import Item from '#models/item'
import Payment from './payment.js'
import { DateTime } from 'luxon'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Item)
  declare items: HasMany<typeof Item>

  @ApiProperty({ example: 1 })
  @column()
  declare user_id: number

  @ApiProperty({ example: 246000 })
  @column()
  declare cartPrice: number

  @hasOne(() => Payment)
  declare payment: HasOne<typeof Payment>

  @column()
  declare priceView: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
