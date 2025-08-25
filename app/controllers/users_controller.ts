import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    const users = await UserService.getAll()
    return response.ok({ data: users })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    console.log(request.body())
    const body = request.body()
    const user = await UserService.create(body)
    return response.created({ data: user })
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const user = await UserService.getById(params.id)
    return response.ok({ data: user })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const user = await UserService.update(params.id, request.body())
    return response.ok({ data: user })
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const user = await UserService.delete(params.id)
    return response.ok(user)
  }
}
