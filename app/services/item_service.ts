import User from '#models/user'
import Product from '#models/product'
import Cart from '#models/cart'
import Item from '#models/item'

import { MoneyManagement } from '../utils/money.js'
import { inject } from '@adonisjs/core'

//expcetions
import { CartNotFoundException } from '#exceptions/carts_exceptions/cart_not_found_exception'
import { ItemNotFoundException } from '#exceptions/items_exceptions/item_not_found_exception'
import { ProductNotFoundException } from '#exceptions/products_exceptions/product_not_found_exception'
import HTTPBadRequestException from '#exceptions/http_exceptions/http_bad_request_exception'

@inject()
export class ItemService {
  constructor(protected moneyManagement: MoneyManagement) {}

  async create(payload: Partial<Item>, user: Partial<User>) {
    const product = await Product.findBy('id', payload.productId)
    if (!product) throw new ProductNotFoundException()

    const cart = await Cart.findBy('user_id', user.id)
    if (!cart) throw new CartNotFoundException()

    if (!payload.product_quantity) {
      throw new HTTPBadRequestException('product_quantity field must be defined')
    }

    payload.cartId = cart.id

    const product_price = Number(product.product_price)

    let items_price: number

    if (payload.product_quantity > 1) {
      items_price = this.moneyManagement.multiply(product_price, payload.product_quantity)
    } else {
      items_price = product_price
    }

    const priceView = this.moneyManagement.createView(items_price)

    const item = await Item.create({
      cartId: payload.cartId,
      productId: payload.productId,
      product_color: payload.product_color,
      product_quantity: payload.product_quantity,
      item_price: items_price,
      price_view: priceView,
    })

    return item
  }

  async all(data: Partial<User>) {
    const cart = await Cart.findBy('user_id', data.id)
    if (!cart) throw new CartNotFoundException()

    const items = await Item.findManyBy('cartId', cart.id)
    if (!items || items.length === 0) throw new ItemNotFoundException()
    return items
  }

  async show(id: number) {
    const item = await Item.findBy('id', id)
    if (!item) throw new ItemNotFoundException()

    return item
  }

  async update(id: number, data: Partial<Item>) {
    const item = await Item.findBy('id', id)
    if (!item) throw new ItemNotFoundException()
    await item.load('product')

    const product_price = item.product.product_price

    let items_price: number
    if (data.product_quantity) {
      items_price = this.moneyManagement.multiply(product_price, data.product_quantity)
      data.item_price = items_price
      data.price_view = this.moneyManagement.createView(items_price)
    }

    item.merge(data)
    await item.save()
    return item
  }

  async delete(id: number) {
    const item = await Item.findBy('id', id)

    if (!item) throw new ItemNotFoundException()

    await item.delete()
    return { message: 'Item deleted successfully', item }
  }
}
