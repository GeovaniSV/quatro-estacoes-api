import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//services
import { OrderService } from '#services/order_service'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'

@inject()
export default class OrdersController {
  constructor(protected orderService: OrderService) {}

  async store({ auth, response }: HttpContext) {
    const user = auth.user
    await user?.load('cart')
    if (!user) throw new UnauthorizedException()

    const userPayment = await this.orderService.payment(user)

    return response.created(userPayment)
  }
}
