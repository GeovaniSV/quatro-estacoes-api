import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//models
import Product from '#models/product'

//services
import { ProductService } from '#services/product_service'

//validator
import {
  createProductValidator,
  openApiCreateProductValidator,
  updateProductValidator,
  uploadImageValidator,
} from '#validators/product_validator'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import HTTPBadRequestException from '#exceptions/http_exceptions/http_bad_request_exception'
import { ProductImageService } from '#services/product_image_service'

@inject()
export default class ProductsController {
  constructor(
    protected productService: ProductService,
    protected productImageService: ProductImageService
  ) {}

  @ApiOperation({
    description:
      'Cadastra um novo produto no banco de dados. Somente usuário administradores podem utilizar essa rota',
  })
  @ApiBody({
    type: () => openApiCreateProductValidator,
    mediaType: 'multipart/form-data',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Retorna um objeto do produto cadastrado',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Bad Request' },
        code: { type: 'string', example: 'E_BAD_REQUEST' },
      },
    },
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
    // const { mainImage, images } = await request.validateUsing(uploadImageValidator)
    const payload = await request.validateUsing(createProductValidator)

    // if (!mainImage) throw new HTTPBadRequestException('Main image should be defined')

    const product = await this.productService.create(payload)

    // await this.productImageService.uploadProductImage(mainImage, product)
    // if (images) {
    //   await this.productImageService.uploadMultipleImages(images, product)
    // }
    // await product.save()

    // await product.load('images')
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
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do produto alterado',
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
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do produto deletado',
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

  @ApiOperation({
    description:
      'Deleta uma imagem específica do storage e do banco de dados com base no seu id e no id do produto. Somente usuários administradores podem utilizar essa rota',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna um objeto do produto cuja imagem foi deletada',
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
    description: 'Product image not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Product image not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
  async destroyProductImage({ params, response }: HttpContext) {
    const { id, imageId } = params
    const result = await this.productImageService.deleteImage(id, imageId)
    return response.ok({ data: result })
  }
}
