import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//models
import User from '#models/user'

//services
import { ProfileService } from '#services/profile_service'

//validators
import { updateProfileValidator } from '#validators/profile_validator'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'

@inject()
export default class ProfilesController {
  constructor(protected profileService: ProfileService) {}

  @ApiOperation({
    description: 'Busca e retorna o usuário e seu perfil',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do usuário, e do seu perfil',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized acces',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized acces' },
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
  //show profile
  async show({ auth, response }: HttpContext) {
    const userAuth = auth.user
    if (!userAuth) throw new UnauthorizedException()
    const id = userAuth.id
    const profile = await this.profileService.getById(id)
    return response.ok({ data: profile })
  }

  @ApiOperation({
    description: 'Atualiza o perfil de um usuário',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do usuário, e do seu perfil',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized acces',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized acces' },
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
  //update profile
  async update({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProfileValidator)
    const userAuth = auth.user
    if (!userAuth) throw new UnauthorizedException()
    const id = userAuth.id
    const profile = await this.profileService.update(id, payload)
    return response.ok({ data: profile })
  }
}
