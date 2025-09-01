import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'
import { inject } from '@adonisjs/core'
import { createUserValidator } from '#validators/user'

@inject()
export default class UsersController {
  constructor(protected userService: UserService) {}

  //save user
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const user = await this.userService.create(payload)

    if (user.status === 400) {
      return response.badRequest({ data: user })
    }

    return response.created({ data: user })
  }

  //query all users
  async index({ response }: HttpContext) {
    const users = await this.userService.getAll()
    return response.ok({ data: users })
  }

  //show unique user
  async show({ params, response }: HttpContext) {
    const user = await this.userService.getById(params.id)
    return response.ok({ data: user })
  }

  //update user
  async update({ params, request, response }: HttpContext) {
    const user = await this.userService.update(params.id, request.body())
    return response.ok({ data: user })
  }

  //delete user
  async destroy({ params, response }: HttpContext) {
    const user = await this.userService.delete(params.id)
    return response.ok(user)
  }
}
