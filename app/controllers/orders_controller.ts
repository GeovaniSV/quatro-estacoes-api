import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@foadonis/openapi/decorators'

//services
import { OrderService } from '#services/order_service'
import { updateOrder } from '#validators/order'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'
import Order from '#models/order'

@inject()
export default class OrdersController {
  constructor(protected orderService: OrderService) {}

  @ApiOperation({
    description:
      'Faz a busca de todos os pedidos existente com base no ID. Somente usuários administradores podem utilizar essa rota',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do produto alterado',
    type: Order,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized acces',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized acces' },
        code: { type: 'string', example: 'E_UNAUTHORIZED' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Forbidden' },
        code: { type: 'string', example: 'E_FORBIDDEN' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Order not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  async index({ response, request }: HttpContext) {
    const page = request.input('page')
    const limit = request.input('limit')
    const orders = await this.orderService.getAllOrder(page, limit)
    return response.ok({ orders })
  }

  @ApiOperation({
    description: 'Faz a busca de todos os pedidos realizados pelo usuário',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna um JSON com todos os pedidos do usuário',
    type: Order,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized acces',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized acces' },
        code: { type: 'string', example: 'E_UNAUTHORIZED' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Order not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  async userOrders({ auth, response, request }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()

    const page = request.input('page')
    const limit = request.input('limit')

    const userOrders = await this.orderService.getUserOrders(user.id, page, limit)

    return response.ok({ userOrders })
  }

  @ApiOperation({
    description:
      'Realiza a alteração de um pedido existente com base no ID. Somente usuários administradores podem utilizar essa rota',
  })
  @ApiBody({
    type: () => updateOrder,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do pedido alterado',
    type: Order,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized acces' },
        code: { type: 'string', example: 'E_UNAUTHORIZED' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Forbidden' },
        code: { type: 'string', example: 'E_FORBIDDEN' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Order not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  async update({ request, response }: HttpContext) {
    const { id } = request.params()

    const payload = await request.validateUsing(updateOrder)

    const order = await this.orderService.update(id, payload)

    return response.ok({ order })
  }
}
