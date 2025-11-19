import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//services
import { OrderService } from '#services/order_service'

//exceptions

@inject()
export default class OrdersController {
  constructor(protected orderService: OrderService) {}
}
