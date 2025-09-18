import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//services
import { ItemService } from '#services/item_service'

//validators
import { createItemValidator, updateItemValidator } from '#validators/item_validator'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import Item from '#models/item'

@inject()
export default class ItemsController {
  constructor(protected itemService: ItemService) {}

  @ApiOperation({
    description: 'Realiza o cadastro de um item à um banco de dados e um carrinho',
  })
  @ApiBody({ type: () => createItemValidator })
  @ApiResponse({
    status: 201,
    description: 'Retorna um objeto do item cadastrado',
    type: Item,
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
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Product not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
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
  //create new item
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()
    const payload = await request.validateUsing(createItemValidator)
    const item = await this.itemService.create(payload, user)
    return response.created({ data: item })
  }

  @ApiOperation({
    description: 'Realiza a listagem de itens dentro do carrinho',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de itens com base no id do carrinho de compras',
    type: [Item],
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
    description: 'Item not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Item not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
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
  //query all items
  async index({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()
    const items = await this.itemService.all(user)
    return response.ok({ data: items })
  }

  @ApiOperation({
    description: 'Realiza a busca de um item específico com base em seu ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna o item',
    type: Item,
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
    description: 'Item not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Item not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
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
  //show unique item
  async show({ params, response }: HttpContext) {
    const item = await this.itemService.show(params.id)

    return response.ok({ data: item })
  }

  @ApiOperation({
    description: 'Realiza a atualização dos dados de um item existente no carrinho de compras',
  })
  @ApiBody({ type: () => updateItemValidator })
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do item atualizado',
    type: Item,
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
    description: 'Item not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Item not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  //update item
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateItemValidator)
    const item = await this.itemService.update(params.id, payload)

    return response.ok({ data: item })
  }

  @ApiOperation({
    description: 'Deleta um item do banco de dados e do carrinho',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do item deletado',
    type: Item,
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Item not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  //delete item
  async destroy({ params, response }: HttpContext) {
    const item = await this.itemService.delete(params.id)

    response.ok({ data: item })
  }
}
