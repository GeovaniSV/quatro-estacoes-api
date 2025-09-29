import hash from '@adonisjs/core/services/hash'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import Cart from '#models/cart'
import Profile from '#models/profile'

import { ApiProperty } from '@foadonis/openapi/decorators'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @ApiProperty({ example: 'Geovani Dos Santos Vargas' })
  @column()
  declare userName: string

  @ApiProperty({ example: 'example@gmail.com' })
  @column()
  declare email: string

  @ApiProperty({ example: 'alo123!.' })
  @column({ serializeAs: null })
  declare password: string

  @ApiProperty({ example: '000.000.000-00' })
  @column()
  declare cpf: string

  @ApiProperty({ example: '(66)99999-9999' })
  @column()
  declare fone: string

  @hasOne(() => Profile, {
    foreignKey: 'user_id',
  })
  declare profile: HasOne<typeof Profile>

  @hasOne(() => Cart, {
    foreignKey: 'user_id',
  })
  declare cart: HasOne<typeof Cart>

  @ApiProperty({ default: 'USER' })
  @column()
  declare role: 'USER' | 'ADMIN'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '2 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
