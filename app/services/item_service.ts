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

    if (!payload.productQuantity) {
      throw new HTTPBadRequestException('productQuantity field must be defined')
    }

    payload.cartId = cart.id

    const product_price = Number(product.productPrice)

    let items_price: number

    if (payload.productQuantity > 1) {
      items_price = this.moneyManagement.multiply(product_price, payload.productQuantity)
    } else {
      items_price = product_price
    }

    const priceView = this.moneyManagement.createView(items_price)

    const item = await Item.create({
      cartId: payload.cartId,
      productId: payload.productId,
      productColor: payload.productColor,
      productQuantity: payload.productQuantity,
      itemPrice: items_price,
      priceView: priceView,
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

    const product_price = item.product.productPrice

    let items_price: number
    if (data.productQuantity) {
      items_price = this.moneyManagement.multiply(product_price, data.productQuantity)
      data.itemPrice = items_price
      data.priceView = this.moneyManagement.createView(items_price)
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
