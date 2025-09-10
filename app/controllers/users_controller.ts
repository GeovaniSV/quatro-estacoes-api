import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'
import { inject } from '@adonisjs/core'
import {
  createUserValidator,
  loginUserValidator,
  updateUserValidator,
} from '#validators/user_validator'
import HTTPUnauthorized from '#exceptions/http_exceptions/HTTP_unauthorized_exceptions'

@inject()
export default class UsersController {
  constructor(protected userService: UserService) {}

  //save user
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    const user = await this.userService.create(payload)

    return response.created({ data: user })
  }

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginUserValidator)

    const token = await this.userService.login(payload)

    return response.ok({ data: token })
  }

  //query all users
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

  //show unique user (admin routes)
  async show({ params, response }: HttpContext) {
    const user = await this.userService.getById(params.id)
    return response.ok({ data: user })
  }

  //Show unique profile user (user routes)
  async showProfile({ auth, response }: HttpContext) {
    const userAuth = auth.user
    if (!userAuth) throw new HTTPUnauthorized('Unauthorized Access')
    const id = userAuth.id
    const user = await this.userService.getById(id)
    return response.ok({ data: user })
  }

  //update user
  async update({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)
    const userAuth = auth.user
    if (!userAuth) throw new HTTPUnauthorized('Unauthorized Access')
    const id = userAuth.id
    const user = await this.userService.update(id, payload)
    return response.ok({ data: user })
  }

  //delete user
  async destroy({ params, response }: HttpContext) {
    const user = await this.userService.delete(params.id)
    return response.ok({ Message: 'User deleted', data: user })
  }
}
