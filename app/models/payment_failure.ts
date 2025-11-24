import Payment from './payment.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'

export default class PaymentFailure extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare stripeCheckoutSession: string

  @column()
  declare stripePaymentIntentId: string

  @column()
  declare failureCode: string

  @column()
  declare failureMessage: string

  @column()
  declare declineCode: string

  @column()
  declare stripeErrorType: string

  @column()
  declare paymentId: number

  @belongsTo(() => Payment)
  declare payment: BelongsTo<typeof Payment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
