import Product from '#models/product'
import Cart from '#models/product'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @ApiProperty({ example: 1 })
  @column()
  declare productId: number

  @ApiProperty({ example: 1 })
  @column()
  declare cartId: number

  @ApiProperty({ example: 15 })
  @column()
  declare productQuantity: number

  @ApiProperty({ example: 'Vermelho esfumaçado' })
  @column()
  declare productColor: string

  @ApiProperty({ example: 246000 })
  @column()
  declare itemPrice: number

  @column()
  declare priceView: string

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => Cart)
  declare cart: BelongsTo<typeof Cart>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
