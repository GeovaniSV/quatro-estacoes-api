import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//services
import { ProductService } from '#services/product_service'

//validator
import { createProductValidator, updateProductValidator } from '#validators/product_validator'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import Product from '#models/product'

@inject()
export default class ProductsController {
  constructor(protected productService: ProductService) {}

  @ApiOperation({
    description:
      'Cadastra um novo produto no banco de dados. Somente usuário administradores podem utilizar essa rota',
  })
  @ApiBody({
    type: () => createProductValidator,
  })
  @ApiResponse({
    status: 201,
    description: 'Retorna um objeto do produto cadastrado',
    type: Product,
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
    status: 409,
    description: 'Product already exists',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Product already exists' },
        code: { type: 'string', example: 'E_ALREADY_EXISTS' },
      },
    },
  })
  //create new product
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)

    const product = await this.productService.create(payload)

    return response.created({ data: product })
  }

  @ApiOperation({
    description:
      'Faz a listagem de todos os produtos, todos os usuários podem utilizar essa rota, inclusive os que não estão autenticados',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de objetos',
    type: [Product],
  })
  //query all products by page and limit from query params
  async index({ request, response }: HttpContext) {
    const page = request.input('page')
    const limit = request.input('limit')
    const products = await this.productService.getAll(page, limit)
    return response.ok({ data: products })
  }

  @ApiOperation({
    description:
      'Faz a busca de um produto específico pelo ID, todos os usuários podem utilizar essa rota, inclusive os que não estão autenticados',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do produto',
    type: Product,
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
  //show unique product
  async show({ params, response }: HttpContext) {
    const product = await this.productService.getById(params.id)
    return response.ok({ data: product })
  }

  @ApiOperation({
    description:
      'Realiza a alteração de um produto existente com base no ID. Somente usuários administradores podem utilizar essa rota',
  })
  @ApiBody({
    type: () => updateProductValidator,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do produto alterado',
    type: Product,
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
  //update product
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProductValidator)
    const product = await this.productService.update(params.id, payload)
    return response.ok({ Message: 'Product updated', data: product })
  }

  @ApiOperation({
    description:
      'Deleta um produto específico do banco de dados com base no seu ID. Somente usuários administradores podem utilizar essa rota',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do produto deletado',
    type: Product,
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
  //delete product
  async destroy({ params, response }: HttpContext) {
    const product = await this.productService.delete(params.id)
    return response.ok({ Message: 'Product deleted', data: product })
  }
}
