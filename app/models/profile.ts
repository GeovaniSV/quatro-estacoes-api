import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @ApiProperty({ example: '78550-202' })
  @column()
  declare cep: string

  @ApiProperty({ example: 'Mato Grosso' })
  @column()
  declare estado: string

  @ApiProperty({ example: 'Sinop' })
  @column()
  declare cidade: string

  @ApiProperty({ example: 'Setor Comercial' })
  @column()
  declare bairro: string

  @ApiProperty({ example: 'Avenida Governador Júlio Campos' })
  @column()
  declare logradouro: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
