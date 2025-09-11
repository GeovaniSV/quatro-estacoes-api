import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'
import { inject } from '@adonisjs/core'
import {
  createUserRequestBody,
  loginUserValidator,
  updateUserValidator,
} from '#validators/user_validator'
import HTTPUnauthorized from '#exceptions/http_exceptions/HTTP_unauthorized_exceptions'
import { ProfileService } from '#services/profile_service'
import { CartService } from '#services/cart_service'

@inject()
export default class UsersController {
  constructor(
    protected userService: UserService,
    protected profileService: ProfileService,
    protected cartService: CartService
  ) {}

  //Register the user
  async register({ request, response }: HttpContext) {
    const requestPayload = await request.validateUsing(createUserRequestBody)

    const userRequest = requestPayload.user
    const profileRequest = requestPayload.profile

    const user = await this.userService.register(userRequest, profileRequest)

    return response.created({ data: user })
  }

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginUserValidator)

    const token = await this.userService.login(payload)

    return response.ok({ data: token })
  }

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
    const profile = await this.profileService.getById(id)
    return response.ok({ data: user, profile })
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
    await this.profileService.delete(params.id)
    await this.cartService.delete(params.id)
    const user = await this.userService.delete(params.id)
    return response.ok({ Message: 'User deleted', data: user })
  }
}
