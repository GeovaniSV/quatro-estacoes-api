import HTTPAlreadyExistsException from '#exceptions/HTTP_already_exists_exception'
import HTTPNotFoundException from '#exceptions/HTTP_not_found_exception'
import Product from '#models/product'

export class ProductService {
  async create(data: Partial<Product>) {
    const hasProduct = await Product.findBy('product_name', data.product_name)

    if (hasProduct) throw new HTTPAlreadyExistsException('Product already exists')

    const product = await Product.create(data)

    return product
  }

  async getAll() {
    const products = await Product.all()
    return products
  }

  async getById(id: number) {
    const product = await Product.findBy('id', id)
    if (!product) throw new HTTPNotFoundException('Product not found')
    return product
  }

  async update(id: number, data: Partial<Product>) {
    const product = await Product.findBy('id', id)

    if (!product) throw new HTTPNotFoundException('Product not found')

    product.merge(data)
    await product.save()

    return product
  }

  async delete(id: number) {
    const product = await Product.findBy('id', id)

    if (!product) throw new HTTPNotFoundException('Product not found')

    await product.delete()

    return product
  }
}
