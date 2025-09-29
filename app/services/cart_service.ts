import Cart from '#models/cart'

//validator
import { createCartValidator } from '#validators/cart_validator'

//Exceptions
import HTTPAlreadyExistsException from '#exceptions/http_exceptions/HTTP_already_exists_exception'
import { CartNotFoundException } from '#exceptions/carts_exceptions/cart_not_found_exception'
import { inject } from '@adonisjs/core'
import { MoneyManagement } from '../utils/money.js'

@inject()
export class CartService {
  constructor(protected moneyManagement: MoneyManagement) {}

  async show(user_id: number) {
    const cart = await Cart.findBy('user_id', user_id)

    if (!cart) {
      const cartData = {
        user_id: Number(user_id),
        cartPrice: 0.0,
      }

      const cartPayload = await createCartValidator.validate(cartData)

      const cart = await Cart.create(cartPayload)
      return cart
    }

    await cart.load('items')

    const totalValue = this.moneyManagement.calculateCartPrice(cart.items)
    const priceView = this.moneyManagement.createView(totalValue)

    cart.merge({
      cartPrice: totalValue,
      priceView: priceView,
    })

    for (let i = 0; i < cart.items.length; i++) {
      await cart.items[i].load('product')
    }

    await cart.save()

    return cart
  }

  async create(data: Partial<Cart>) {
    const hasCart = await Cart.findBy('user_id', data.user_id)

    if (hasCart) throw new HTTPAlreadyExistsException('Cart already exists')

    data.priceView = this.moneyManagement.createView(0)

    const cart = await Cart.create(data)
    return cart
  }

  async update(user_id: number, data: Partial<Cart>) {
    const cart = await Cart.findBy('user_id', user_id)
    if (!cart) throw new CartNotFoundException()
    await cart.load('items')

    const totalValue = this.moneyManagement.calculateCartPrice(cart.items)
    const priceView = this.moneyManagement.createView(totalValue)

    cart.merge(data)
    cart.merge({
      cartPrice: totalValue,
      priceView: priceView,
    })

    await cart.save()

    return cart
  }

  async delete(user_id: number) {
    const cart = await Cart.findBy('user_id', user_id)

    if (!cart) throw new CartNotFoundException()

    await cart.delete()
    return { message: 'Cart deleted successfully' }
  }
}
