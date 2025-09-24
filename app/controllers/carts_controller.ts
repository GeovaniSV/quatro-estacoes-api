import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import Cart from '#models/cart'

//services
import { CartService } from '#services/cart_service'

//validators
import { updateCartValidator } from '#validators/cart_validator'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'

@inject()
export default class CartsController {
  constructor(protected cartService: CartService) {}

  @ApiOperation({
    description: 'Retorna o carrinho de compras do usuário cadastrado que fez a requisição',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna o objeto do carrinho de compras do usuário',
    type: Cart,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized acces' },
        code: { type: 'string', example: 'E_UNAUTHORIZED' },
      },
    },
  })
  //show unique cart
  async show({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()
    const id = user.id

    const cart = await this.cartService.show(id)

    return response.ok({ cart })
  }

  @ApiOperation({
    description:
      'Realiza a atualização do carrinho de compras do usuário cadastrado que fez a requsição',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do carrinho atualizado',
    type: Cart,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
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
    description: 'Cart not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Cart not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  //update cart
  async update({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()
    const id = user.id

    const payload = await request.validateUsing(updateCartValidator)
    const cart = await this.cartService.update(id, payload)

    return response.ok({ Message: 'cart updated', data: cart })
  }

  @ApiOperation({
    description: 'Deleta o carrinho de compras do usuário cadastrado que fez a requisição',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do carrinho',
    type: Cart,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
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
    description: 'Cart not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Cart not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  //delete cart
  async destroy({ params, response }: HttpContext) {
    const cart = await this.cartService.delete(params.id)

    return response.ok({ Message: 'cart deleted', data: cart })
  }
}
