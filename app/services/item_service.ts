import User from '#models/user'
import Product from '#models/product'
import Cart from '#models/cart'
import Item from '#models/item'
import { CartNotFoundException } from '#exceptions/carts_exceptions/cart_not_found_exception'
import { ItemNotFoundException } from '#exceptions/items_exceptions/item_not_found_exception'
import { ProductNotFoundException } from '#exceptions/products_exceptions/product_not_found_exception'
import HTTPBadRequestException from '#exceptions/http_exceptions/http_bad_request_exception'

export class ItemService {
  async create(payload: Partial<Item>, user: Partial<User>) {
    const product = await Product.findBy('id', payload.product_id)
    if (!product) throw new ProductNotFoundException()

    const cart = await Cart.findBy('user_id', user.id)
    if (!cart) throw new CartNotFoundException()

    if (!payload.product_quantity) {
      throw new HTTPBadRequestException('product_quantity field must be defined')
    }

    payload.cart_id = cart.id

    const items_price = product.product_price * payload.product_quantity
    console.log(product.product_price)
    const item = await Item.create({
      cart_id: payload.cart_id,
      product_id: payload.product_id,
      product_color: payload.product_color,
      product_quantity: payload.product_quantity,
      item_price: items_price,
    })

    return item
  }

  async all(data: Partial<User>) {
    const cart = await Cart.findBy('user_id', data.id)
    if (!cart) throw new CartNotFoundException()

    const items = await Item.findManyBy('cart_id', cart.id)
    if (!items || items.length === 0) throw new ItemNotFoundException()
    return items
  }
}
