import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//services
import { OrderService } from '#services/order_service'
import { updateOrder } from '#validators/order'

//exceptions

@inject()
export default class OrdersController {
  constructor(protected orderService: OrderService) {}

  async index({ response }: HttpContext) {
    const orders = await this.orderService.getAllOrder(1, 10)
    return response.ok({ orders })
  }

  async update({ request, response }: HttpContext) {
    const { id } = request.params()

    const payload = await request.validateUsing(updateOrder)

    const order = await this.orderService.update(id, payload)

    return response.ok({ order })
  }
}
