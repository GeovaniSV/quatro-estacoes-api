import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('stripe_checkout_session_id')
      table.string('stripe_payment_intent_id')
      table.integer('amount')
      table.string('amount_view')
      table.string('payment_method')
      table.string('currency', 3)
      table.string('status')

      table.integer('cart_id').unsigned().references('carts.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
