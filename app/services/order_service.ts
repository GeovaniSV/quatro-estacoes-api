import Order from '#models/order'
import Cart from '#models/cart'
import OrderItem from '#models/order_item'
import User from '#models/user'
import Payment from '#models/payment'
import HTTPNotFoundException from '#exceptions/http_exceptions/HTTP_not_found_exception'
import { inject } from '@adonisjs/core'
import { MoneyManagement } from '../utils/money.js'
import { CartNotFoundException } from '#exceptions/carts_exceptions/cart_not_found_exception'
import { UserNotFoundException } from '#exceptions/users_exceptions/user_not_found_exception'
import { SendEmail } from '../utils/handleEmail.js'
import HTTPInternalErrorException from '#exceptions/http_exceptions/HTTP_internal_error_execption'

@inject()
export class OrderService {
  constructor(
    protected moneyManagement: MoneyManagement,
    protected sendEmail: SendEmail
  ) {}

  async store(cartId: number, paymentId: number) {
    const cart = await Cart.findBy('id', cartId)
    if (!cart) throw new CartNotFoundException()
    if (!cart) throw new CartNotFoundException()
    await cart.load('items')
    const items = cart.items
    items.map(async (item) => await item.load('product'))

    const user = await User.findBy('id', cart.user_id)
    if (!user) throw new UserNotFoundException()

    const payment = await Payment.findBy('id', paymentId)
    if (!payment) throw new HTTPNotFoundException('Payment not found')

    const priceView = this.moneyManagement.createView(payment.amount)

    const order = await Order.create({
      userId: cart.user_id,
      paymentId: payment.id,
      purchase_price: payment.amount,
      price_view: priceView,
      status: 'em andamento',
    })

    items.map(async (item) => {
      await OrderItem.create({
        productQuantity: item.productQuantity,
        productColor: item.productColor,
        itemPrice: item.itemPrice,
        priceView: item.priceView,
        orderId: order.id,
        productId: item.product.id,
      })
    })

    const orderId = order.id

    try {
      this.sendEmail.sendClientEmail(user.email, user.userName, items, cart.priceView, orderId)
    } catch (error) {
      if (error) throw new HTTPInternalErrorException('Something went wrong while sending email')
    }
  }

  async getAllOrder(page: number, limit: number) {
    const orders = await Order.query()
      .preload('user')
      .preload('OrderItems')
      .preload('payment')
      .paginate(page, limit)
    if (!orders || OrderService.length == 0) throw new HTTPNotFoundException('Orders not found')
    return orders
  }

  async getUserOrders(userId: number, page: number, limit: number) {
    const orders = await Order.query()
      .preload('OrderItems')
      .preload('payment')
      .where('user_id', userId)
      .paginate(page, limit)
    if (!orders || orders.length === 0) throw new HTTPNotFoundException('Orders not found')

    return orders
  }

  async update(orderId: number, payload: Partial<Order>) {
    const order = await Order.findBy('id', orderId)
    if (!order) throw new HTTPNotFoundException('Order not found')

    order.merge(payload)
    await order.save()
    return order
  }
}
