import type { HttpContext } from '@adonisjs/core/http'
import { ProductService } from '#services/product_service'
import { inject } from '@adonisjs/core'
import { createProductValidator, updateProductValidator } from '#validators/product_validator'

@inject()
export default class ProductsController {
  constructor(protected productService: ProductService) {}

  //create new product
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)

    const product = await this.productService.create(payload)

    return response.created({ data: product })
  }

  //query all products by page and limit from query params
  async index({ request, response }: HttpContext) {
    const page = request.input('page')
    const limit = request.input('limit')
    const products = await this.productService.getAll(page, limit)
    return response.ok({ data: products })
  }

  //show unique product
  async show({ params, response }: HttpContext) {
    const product = await this.productService.getById(params.id)
    return response.ok({ data: product })
  }

  //update product
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProductValidator)
    const product = await this.productService.update(params.id, payload)
    return response.ok({ Message: 'Product updated', data: product })
  }

  //delete product
  async destroy({ params, response }: HttpContext) {
    const product = await this.productService.delete(params.id)
    return response.ok({ Message: 'Product deleted', data: product })
  }
}
