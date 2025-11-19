import env from '#start/env'
import Cart from '#models/cart'
import Stripe from 'stripe'
const STRIPE_API_SECRET_KEY = env.get('STRIPE_API_SECRET_KEY')!

//exceptions
import { ItemNotFoundException } from '#exceptions/items_exceptions/item_not_found_exception'
import User from '#models/user'

export class StripeWebHookService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(STRIPE_API_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  }

  async payment(user: Partial<User>) {
    const cart = await Cart.query()
      .where('user_id', user.id!)
      .preload('items', (query) => query.preload('product'))
      .firstOrFail()

    if (!cart || cart.items.length === 0) throw new ItemNotFoundException()

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => {
      return {
        quantity: item.productQuantity,
        price_data: {
          currency: 'BRL',
          product_data: {
            name: item.product.productName,
            description: item.product.productDescription,
          },
          unit_amount: item.product.productPrice,
        },
      }
    })

    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${env.get('FRONTEND_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.get('FRONTEND_URL')}/cart`,
      metadata: {
        user_id: user.id!.toString(),
        cart_id: cart.id.toString(),
      },
      payment_method_types: ['card', 'boleto'],
    })

    return session
  }

  async handleCheckoutSessionCompleted() {}
}
