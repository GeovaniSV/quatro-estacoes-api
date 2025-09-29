import ProductImage from './product_image.js'
import Item from '#models/item'
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { ApiProperty } from '@foadonis/openapi/decorators'

export default class Product extends BaseModel {
  @ApiProperty()
  @column({ isPrimary: true })
  declare id: number

  @ApiProperty({ example: 'Estilo n°1' })
  @column()
  declare productName: string

  @ApiProperty({
    example:
      'Vaso de cimento com fibra de vidro. Altura: 45 cm; Diâmetro de boca: 35 cm; Diâmetro da base: 22 cm',
    maxLength: 120,
  })
  @column()
  declare productDescription: string

  @ApiProperty({ example: 15400 })
  @column()
  declare productPrice: number

  @column()
  declare priceView: string

  @ApiProperty({ example: 'products/Estilo_n_1/product_1_1758912772479' })
  @column()
  declare imagePublicId: string

  @hasMany(() => Item)
  declare items: HasMany<typeof Item>

  @hasMany(() => ProductImage)
  declare images: HasMany<typeof ProductImage>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
