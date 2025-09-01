import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'

export default class UsersController {
  constructor(protected userService: UserService) {}

  //save user
  async store({ request, response }: HttpContext) {
    console.log(request.body())
    // const body = request.body()
    // const user = await this.userService.create(body)
    return response.created({ data: request.body() })
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
