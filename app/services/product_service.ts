import Product from '#models/product'

//Exceptions
import { ProductAlreadyExistsException } from '#exceptions/products_exceptions/product_already_exists_exception'
import { ProductNotFoundException } from '#exceptions/products_exceptions/product_not_found_exception'

export class ProductService {
  async create(data: Partial<Product>) {
    const hasProduct = await Product.findBy('product_name', data.product_name)

    if (hasProduct) throw new ProductAlreadyExistsException()

    const product = await Product.create(data)

    return product
  }

  async getAll() {
    const products = await Product.all()
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
