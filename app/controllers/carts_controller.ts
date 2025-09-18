import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//services
import { CartService } from '#services/cart_service'

//validators
import { updateCartValidator } from '#validators/cart_validator'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'

@inject()
export default class CartsController {
  constructor(protected cartService: CartService) {}

  //show unique cart
  async show({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()
    const id = user.id

    const cart = await this.cartService.show(id)

    return response.ok({ cart })
  }

  //update cart
  async update({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()
    const id = user.id

    const payload = await request.validateUsing(updateCartValidator)
    const cart = await this.cartService.update(id, payload)

    return response.ok({ Message: 'cart updated', data: cart })
  }

  //delete cart
  async destroy({ params, response }: HttpContext) {
    const cart = await this.cartService.delete(params.id)

    return response.ok({ Message: 'cart deleted', data: cart })
  }
}
