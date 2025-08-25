import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'

const userService = new UserService()

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    return request
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    console.log(request.body())
    const body = request.body()
    const user = await userService.createUser(body)
    return {
      user,
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
