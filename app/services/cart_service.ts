import Cart from '#models/cart'

export class CartService {
  async createCart() {
    const cart = await Cart.create({
      cart_price: 0.0,
    })
    return cart.toJSON()
  }
}
