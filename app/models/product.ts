import Item from '#models/item'
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { ApiProperty } from '@foadonis/openapi/decorators'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @ApiProperty({ example: 'Estilo n°1' })
  @column()
  declare product_name: string

  @ApiProperty({
    example:
      'Vaso de cimento com fibra de vidro. Altura: 45 cm; Diâmetro de boca: 35 cm; Diâmetro da base: 22 cm',
  })
  @column()
  declare product_description: string

  @ApiProperty({ example: 16400 })
  @column()
  declare product_price: number

  @column()
  declare price_view: string

  @hasMany(() => Item)
  declare items: HasMany<typeof Item>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
