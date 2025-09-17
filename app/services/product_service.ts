import Product from '#models/product'
import db from '@adonisjs/lucid/services/db'
import { MoneyManagement } from '../utils/money.js'
import { inject } from '@adonisjs/core'

//Exceptions
import { ProductAlreadyExistsException } from '#exceptions/products_exceptions/product_already_exists_exception'
import { ProductNotFoundException } from '#exceptions/products_exceptions/product_not_found_exception'

@inject()
export class ProductService {
  constructor(protected moneyManagement: MoneyManagement) {}

  async create(data: Partial<Product>) {
    const hasProduct = await Product.findBy('product_name', data.product_name)

    if (hasProduct) throw new ProductAlreadyExistsException()

    const product = await Product.create(data)

    const priceView = this.moneyManagement.createView(product.product_price)
    product.merge({
      price_view: priceView,
    })

    return product
  }

  async getAll(page: number, limit: number) {
    const products = await db.from('products').paginate(page, limit)
    if (!products || products.length === 0) throw new ProductNotFoundException()

    return products
  }

  async getById(id: number) {
    const product = await Product.findBy('id', id)
    if (!product) throw new ProductNotFoundException()
    return product
  }

  async update(id: number, data: Partial<Product>) {
    const product = await Product.findBy('id', id)

    if (!product) throw new ProductNotFoundException()

    const priceView = this.moneyManagement.createView(product.product_price)
    data.price_view = priceView

    product.merge(data)
    await product.save()

    return product
  }

  async delete(id: number) {
    const product = await Product.findBy('id', id)

    if (!product) throw new ProductNotFoundException()

    await product.delete()

    return product
  }
}
