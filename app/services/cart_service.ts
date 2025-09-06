import Cart from '#models/cart'

//validator
import { createCartValidator } from '#validators/cart_validator'

//Exceptions
import HTTPNotFoundException from '#exceptions/http_exceptions/HTTP_not_found_exception'
import HTTPAlreadyExistsException from '#exceptions/http_exceptions/HTTP_already_exists_exception'

export class CartService {
  async show(user_id: number) {
    const hasCart = await Cart.findBy('user_id', user_id)

    if (!hasCart) {
      const cartData = {
        user_id: Number(user_id),
        cart_price: 0.0,
      }

      const cartPayload = await createCartValidator.validate(cartData)

      const cart = await Cart.create(cartPayload)
      return cart
    }

    return hasCart
  }

  async create(data: Partial<Cart>) {
    const hasCart = await Cart.findBy('user_id', data.user_id)

    if (hasCart) throw new HTTPAlreadyExistsException('Cart already exists')

    const cart = await Cart.create(data)
    return cart
  }

  async update(user_id: number, data: Partial<Cart>) {
    const cart = await Cart.findBy('user_id', user_id)
    if (!cart) throw new HTTPNotFoundException('Cart not found')

    cart.merge(data)
    await cart.save()

    return cart
  }

  async delete(user_id: number) {
    const cart = await Cart.findBy('user_id', user_id)

    if (!cart) throw new HTTPNotFoundException('Cart not found')

    await cart.delete()
    return { message: 'Cart deleted successfully' }
  }
}
