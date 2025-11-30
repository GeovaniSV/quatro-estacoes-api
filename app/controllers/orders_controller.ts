import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//services
import { OrderService } from '#services/order_service'
import { updateOrder } from '#validators/order'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'

@inject()
export default class OrdersController {
  constructor(protected orderService: OrderService) {}

  async index({ response, request }: HttpContext) {
    const page = request.input('page')
    const limit = request.input('limit')
    const orders = await this.orderService.getAllOrder(page, limit)
    return response.ok({ orders })
  }

  async userOrders({ auth, response, request }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()

    const page = request.input('page')
    const limit = request.input('limit')

    console.log(user)
    console.log(page)
    console.log(limit)

    const userOrders = await this.orderService.getUserOrders(user.id, page, limit)

    console.log(userOrders)
    return response.ok({ userOrders })
  }

  async update({ request, response }: HttpContext) {
    const { id } = request.params()

    const payload = await request.validateUsing(updateOrder)

    const order = await this.orderService.update(id, payload)

    return response.ok({ order })
  }
}
