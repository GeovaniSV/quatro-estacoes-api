import env from '#start/env'
import Cart from '#models/cart'
import Stripe from 'stripe'
const STRIPE_API_SECRET_KEY = env.get('STRIPE_API_SECRET_KEY')!

//exceptions
import { ItemNotFoundException } from '#exceptions/items_exceptions/item_not_found_exception'
import User from '#models/user'
import PaymentIntent from '#models/payment_intent'
import HTTPAlreadyExistsException from '#exceptions/http_exceptions/HTTP_already_exists_exception'
import db from '@adonisjs/lucid/services/db'

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
        userId: user.id!.toString(),
        cartId: cart.id.toString(),
      },
      client_reference_id: user.id?.toString(),
      payment_method_types: ['card', 'boleto'],
      customer_email: user.email,
    })

    return session
  }

  async handleStripeWebHookGenericEvent(payload: Stripe.CheckoutSessionCompletedEvent) {
    const hasLog = await PaymentIntent.findBy('id', payload.data.object.id)
    if (hasLog) return new HTTPAlreadyExistsException('PaymentIntent already exists')

    const session = await this.stripe.checkout.sessions.list({
      limit: 1,
      payment_intent: payload.data.object.payment_intent!.toString(),
    })

    console.log('idempotencyKey: ', payload.request?.idempotency_key)
    let checkoutLogObject = {
      id: payload.data.object.id,
      amount: payload.data.object.amount_total!,
      currency: payload.data.object.currency!,
      idempotencyKey: payload.request?.idempotency_key!,
      userId: Number(payload.data.object.metadata!.userId),
      status: payload.data.object.payment_status,
    }

    if (session.data) {
      session.data.map((data) => {
        checkoutLogObject = {
          id: data.id,
          amount: data.amount_total!,
          currency: data.currency!,
          idempotencyKey: payload.request?.idempotency_key!,
          userId: Number(data.client_reference_id),
          status: data.payment_status,
        }
      })
    }

    console.log('Session: ', session)
    await PaymentIntent.create({
      id: checkoutLogObject.id,
      amount: checkoutLogObject.amount,
      currency: checkoutLogObject.currency,
      idempotencyKey: checkoutLogObject.idempotencyKey,
      userId: checkoutLogObject.userId,
      status: checkoutLogObject.status,
    })
  }

  async getAllPayment(limit: number, page: number) {
    const paymentes = await db.from('payment_intents').paginate(limit, page)
    return paymentes
  }
}
