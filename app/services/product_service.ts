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
    const hasProduct = await Product.findBy('productName', data.productName)

    if (hasProduct) throw new ProductAlreadyExistsException()

    const priceView = this.moneyManagement.createView(data.productPrice!)
    const product = await Product.create({
      productName: data.productName,
      productDescription: data.productDescription,
      productPrice: data.productPrice,
      imagePublicId: data.imagePublicId,
      priceView: priceView,
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

    await product.load('images')

    return product
  }

  async update(id: number, data: Partial<Product>) {
    const product = await Product.findBy('id', id)

    if (!product) throw new ProductNotFoundException()

    const priceView = this.moneyManagement.createView(product.productPrice)
    data.priceView = priceView

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
