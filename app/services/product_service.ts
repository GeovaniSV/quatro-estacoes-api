import Product from '#models/product'
import { MoneyManagement } from '../utils/money.js'
import { inject } from '@adonisjs/core'

//Exceptions
import { ProductAlreadyExistsException } from '#exceptions/products_exceptions/product_already_exists_exception'
import { ProductNotFoundException } from '#exceptions/products_exceptions/product_not_found_exception'
import { ProductFilter, ProductFilters } from '../filters/products_filters.js'

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

  async getAll(filters: ProductFilters) {
    const query = Product.query()

    new ProductFilter(query, filters!).apply()

    const products = await query.preload('images').paginate(filters.page!, filters.per_page)

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

    const priceView = this.moneyManagement.createView(data.productPrice!)

    console.log(priceView)

    product.merge({
      productName: data.productName,
      productDescription: data.productDescription,
      productPrice: data.productPrice,
      priceView: priceView,
    })
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
