import Cart from './cart.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare stripeCheckoutSessionId: string

  @column()
  declare stripePaymentIntentId: string

  @column()
  declare amount: number

  @column()
  declare paymentMethod: string

  @column()
  declare currency: string

  @column()
  declare status: string

  @belongsTo(() => Cart)
  declare cart: BelongsTo<typeof Cart>

  @column()
  declare cartId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
