import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//services
import { UserService } from '#services/user_service'
import { ProfileService } from '#services/profile_service'
import { CartService } from '#services/cart_service'

//validators
import {
  createUserRequestBody,
  loginUserValidator,
  updateUserValidator,
} from '#validators/user_validator'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'

import { ApiOperation, ApiBody, ApiResponse } from '@foadonis/openapi/decorators'
import User from '#models/user'

@inject()
export default class UsersController {
  constructor(
    protected userService: UserService,
    protected profileService: ProfileService,
    protected cartService: CartService
  ) {}

  @ApiOperation({
    description: 'Cadastra um novo usuário ao banco de dados',
  })
  @ApiBody({ type: () => createUserRequestBody })
  @ApiResponse({ status: 201, description: 'Created', type: [User] })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User already exists' },
        code: { type: 'string', example: 'E_USER_EXISTS' },
      },
    },
  })
  async register({ request, response }: HttpContext) {
    const requestPayload = await request.validateUsing(createUserRequestBody)

    const userRequest = requestPayload.user
    const profileRequest = requestPayload.profile

    const user = await this.userService.register(userRequest, profileRequest)

    return response.created({ data: user })
  }

  @ApiOperation({
    description:
      'Realiza o login e autenticação de um usuário, retornando o token de acesso ao sistema',
  })
  @ApiBody({ type: () => loginUserValidator })
  @ApiResponse({
    status: 200,
    description: 'Retorna o token de acesso junto com as habilidades do usuário',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'Bearer' },
            name: { type: 'string' },
            token: {
              type: 'string',
              example: 'oat_...',
            },
            lastUsedAt: { type: 'string' },
            expiresAt: { type: 'string', example: '2025-09-20T15:00:00.719Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User Invalid Credentials',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User invalid credentials' },
        code: { type: 'string', example: 'E_BAD_REQUEST' },
      },
    },
  })
  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginUserValidator)

    const token = await this.userService.login(payload)

    return response.ok({ data: token })
  }

  @ApiOperation({
    description:
      'Realiza a listagem de todos os usuários cadastrados no sistema, com paginação. Rota utilizada somente por usuários administradores',
  })
  @ApiResponse({ status: 200, description: 'Retorna uma lista de usuários', type: [User] })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  //query all users by page and limit from query params
  async index({ request, response }: HttpContext) {
    const page = request.input('page')
    const limit = request.input('limit')
    console.log({
      page,
      limit,
    })
    const data = await this.userService.getAll(page, limit)
    return response.ok({ data })
  }

  @ApiOperation({
    description:
      'Realiza a busca por um unico usuário no sistema passando o parâmetro ID para a busca. Rota utilizada somente por usuários administradores',
  })
  @ApiResponse({ status: 200, description: 'Retorna o objeto de um usuário', type: User })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  //show unique user (admin routes)
  async show({ params, response }: HttpContext) {
    const user = await this.userService.getById(params.id)
    return response.ok({ data: user })
  }

  @ApiOperation({
    description:
      'Realiza a busca por um único usuários juntamente com seu perfil, passando o ID como parâmetro de busca, todos os usuários cadastrados podem utilizar essa rota',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna o objeto de um usuário junto com o objeto de seu perfil',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  //Show unique profile user (user routes)
  async showProfile({ auth, response }: HttpContext) {
    const userAuth = auth.user
    if (!userAuth) throw new UnauthorizedException()
    const id = userAuth.id
    const user = await this.userService.getById(id)
    const profile = await this.profileService.getById(id)
    return response.ok({ data: user, profile })
  }

  @ApiOperation({
    description: 'Realiza a atualização de dados de um usuário cadastrado.',
  })
  @ApiBody({ type: () => updateUserValidator })
  @ApiResponse({ status: 200, description: 'Retorna o objeto do usuário alterado', type: User })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized access' },
        code: { type: 'string', example: 'E_UNAUTHORIZED' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  //update user
  async update({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)
    const userAuth = auth.user
    if (!userAuth) throw new UnauthorizedException()
    const id = userAuth.id
    const user = await this.userService.update(id, payload)
    return response.ok({ data: user })
  }

  @ApiOperation({
    description:
      'Realiza a exclusão de um usuário do sistema. Rota utilizada somente por usuários administradores.',
  })
  @ApiResponse({ status: 200, description: 'Retorna o objeto do usuário deletado', type: User })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  //delete user
  async destroy({ params, response }: HttpContext) {
    await this.profileService.delete(params.id)
    await this.cartService.delete(params.id)
    const user = await this.userService.delete(params.id)
    return response.ok({ Message: 'User deleted', data: user })
  }
}
