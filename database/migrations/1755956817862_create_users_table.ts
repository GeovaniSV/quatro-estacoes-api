import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.string('user_name').nullable()
      table.string('email', 120).notNullable().unique()
      table.string('password').notNullable()
      table.string('cpf', 14).notNullable()
      table.string('fone', 16).notNullable()
      table.string('cep', 9).notNullable()
      table.string('estado')
      table.string('cidade')
      table.string('bairro')
      table.string('logradouro')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
