import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('purchase_price')
      table.string('price_view')
      table.enum('status', ['em andamento', 'finalizado'], {
        useNative: true,
        enumName: 'order_status',
        existingType: false,
      })

      table.integer('user_id').unsigned().references('users.id')
      table.integer('payment_id').references('payments.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS order_status')
  }
}
