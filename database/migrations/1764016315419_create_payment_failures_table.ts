import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payment_failures'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('stripe_payment_id')
      table.string('stripe_checkout_session')
      table.string('failure_code')
      table.string('failure_message')
      table.string('decline_code')
      table.string('stripe_error_type')

      table.integer('payment_id').references('payments.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
