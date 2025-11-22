import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payment_intents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').unique()
      table.integer('amount')
      table.string('currency', 3)
      table.string('idempotency_key', 255)
      table.string('status')

      table.integer('user_id').references('users.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
