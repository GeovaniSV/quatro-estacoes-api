import HTTPUnauthorized from '#exceptions/http_exceptions/HTTP_unauthorized_exceptions'
import { ProfileService } from '#services/profile_service'
import { updateProfileValidator } from '#validators/profile_validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProfilesController {
  constructor(protected profileService: ProfileService) {}

  //show profile
  async show({ auth, response }: HttpContext) {
    const userAuth = auth.user
    if (!userAuth) throw new HTTPUnauthorized('Unauthorized Access')
    const id = userAuth.id
    const profile = await this.profileService.getById(id)
    return response.ok({ data: profile })
  }

  //update profile
  async update({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProfileValidator)
    const userAuth = auth.user
    if (!userAuth) throw new HTTPUnauthorized('Unauthorized Access')
    const id = userAuth.id
    const profile = await this.profileService.update(id, payload)
    return response.ok({ data: profile })
  }
}
