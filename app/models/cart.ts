import Item from '#models/item'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
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

  @column()
  declare priceView: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
