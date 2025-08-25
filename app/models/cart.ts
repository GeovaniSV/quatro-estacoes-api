import Item from '#models/item'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Item, {
    foreignKey: 'cart_id',
  })
  declare items: HasMany<typeof Item>

  @column()
  declare user_id: number

  @column()
  declare cart_price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
