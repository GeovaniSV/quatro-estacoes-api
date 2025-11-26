import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('product_quantity')
      table.string('product_color', 80)
      table.integer('item_price')
      table.string('price_view')

      table.integer('order_id').unsigned().references('orders.id').onDelete('CASCADE')
      table.integer('product_id').unsigned().references('products.id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
