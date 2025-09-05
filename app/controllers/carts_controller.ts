import { CartService } from '#services/cart_service'
import { updateCartValidator } from '#validators/cart_validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CartsController {
  constructor(protected cartService: CartService) {}

  //show unique cart
  async show({ params, response }: HttpContext) {
    const cart = await this.cartService.show(params.id)
    return response.ok({ data: cart })
  }

  //update cart
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCartValidator)
    const cart = await this.cartService.update(params.id, payload)
    return response.ok({ Message: 'cart updated', data: cart })
  }

  //delete cart
  async destroy({ params, response }: HttpContext) {
    const cart = await this.cartService.delete(params.id)
    return response.ok({ Message: 'cart deleted', data: cart })
  }
}
