import Cart from '#models/cart'

export class CartService {
  static async getAll() {
    return await Cart.all()
  }

  static async getById(id: number) {
    return await Cart.findOrFail(id)
  }

  static async create(data: Partial<Cart>) {
    return await Cart.create(data)
  }

  static async update(id: number, data: Partial<Cart>) {
    const cart = await Cart.findOrFail(id)
    cart.merge(data)
    await cart.save()
    return cart
  }

  static async delete(id: number) {
    const cart = await Cart.findOrFail(id)
    await cart.delete()
    return { message: 'Cart deleted successfully' }
  }
}
