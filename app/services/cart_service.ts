import Cart from '#models/cart'

export class CartService {
  async getById(id: number) {
    return await Cart.findOrFail(id)
  }

  async create(data: Partial<Cart>) {
    return await Cart.create(data)
  }

  async update(id: number, data: Partial<Cart>) {
    const cart = await Cart.findOrFail(id)
    cart.merge(data)
    await cart.save()
    return cart
  }

  async delete(id: number) {
    const cart = await Cart.findOrFail(id)
    await cart.delete()
    return { message: 'Cart deleted successfully' }
  }
}
