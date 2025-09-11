import Item from '#models/item'
import { DateTime } from 'luxon'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @manyToMany(() => Item)
  declare items: ManyToMany<typeof Item>

  @column()
  declare user_id: number

  @column()
  declare cart_price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
