import env from '#start/env'
import Cart from '#models/cart'
import User from '#models/user'
import Stripe from 'stripe'
import Payment from '#models/payment'
import PaymentFailure from '#models/payment_failure'
import { addMinutes } from 'date-fns'
import { inject } from '@adonisjs/core'
import { OrderService } from './order_service.js'

//exceptions
import { ItemNotFoundException } from '#exceptions/items_exceptions/item_not_found_exception'
import HTTPAlreadyExistsException from '#exceptions/http_exceptions/HTTP_already_exists_exception'

const STRIPE_API_SECRET_KEY = env.get('STRIPE_API_SECRET_KEY')!

@inject()
export class StripeWebHookService {
  private stripe: Stripe

  constructor(protected orderService: OrderService) {
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

    const dateNow = new Date()

    const futureDate = addMinutes(dateNow, 30)

    let timestampExpireOn = Math.floor(futureDate.getTime() / 1000)

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
      customer_creation: 'always',
      expires_at: timestampExpireOn,
    })

    return session
  }

  async handleCheckoutSessionCompleteEvent(payload: Stripe.Checkout.Session) {
    const hasLog = await Payment.findBy('stripeCheckoutSessionId', payload.id.toString())
    if (hasLog) return new HTTPAlreadyExistsException('PaymentIntent already exists')

    let paymentMethodType = null
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      payload.payment_intent as string
    )
    if (payload.payment_intent) {
      if (paymentIntent.payment_method) {
        const paymentMethod = await this.stripe.paymentMethods.retrieve(
          paymentIntent.payment_method as string
        )
        paymentMethodType = paymentMethod.type
      }
    }

    let checkoutLogObject = {
      id: payload.id,
      amount: payload.amount_total,
      currency: payload.currency,
      payment_method: paymentMethodType,
      cartId: Number(payload.metadata!.cartId),
      status: payload.payment_status && paymentIntent.status,
    }

    if (paymentIntent) {
      checkoutLogObject = {
        id: payload.id,
        amount: paymentIntent.amount!,
        currency: paymentIntent.currency!,
        payment_method: paymentMethodType,
        cartId: Number(payload.metadata!.cartId),
        status: paymentIntent.status!,
      }
    }

    await Payment.create({
      stripeCheckoutSessionId: checkoutLogObject.id,
      amount: checkoutLogObject.amount!,
      currency: checkoutLogObject.currency!,
      paymentMethod: checkoutLogObject.payment_method!,
      cartId: checkoutLogObject.cartId,
      status: checkoutLogObject.status,
    })
  }

  async handlePaymentIntentSucceeded(payload: Stripe.PaymentIntent) {
    const sessions = await this.stripe.checkout.sessions.list({
      limit: 1,
      payment_intent: payload.id,
    })

    const session = sessions.data[0]
    const cartId = Number(session.metadata!.cartId)

    const payment = await Payment.findBy('stripeCheckoutSessionId', session.id.toString())

    if (payment) {
      if (
        payment.status == 'requires_action' ||
        payment.status == 'paid' ||
        payment.status == 'unpaid'
      ) {
        payment.merge({
          status: payload.status,
        })
        await payment.save()
      }
      await this.orderService.store(cartId, payment.id)
      return
    }

    if (!payment) {
      let paymentMethodType = null
      if (payload.payment_method) {
        const paymentMethod = await this.stripe.paymentMethods.retrieve(
          payload.payment_method as string
        )
        paymentMethodType = paymentMethod.type
      }
      let sessionObjectSolved = {
        id: 'Payment_Intent_ID' + payload.id,
        amount: payload.amount,
        currency: payload.currency,
        payment_method: paymentMethodType!,
        cartId: cartId,
        status: payload.status,
      }

      sessionObjectSolved.id = session.id
      sessionObjectSolved.cartId = Number(session.metadata!.cartId)

      const newPayment = await Payment.create({
        stripeCheckoutSessionId: sessionObjectSolved.id,
        amount: sessionObjectSolved.amount,
        currency: sessionObjectSolved.currency,
        paymentMethod: sessionObjectSolved.payment_method,
        status: sessionObjectSolved.status,
        cartId: sessionObjectSolved.cartId,
      })
      await this.orderService.store(cartId, newPayment!.id)
      return
    }

    return
  }

  async handlePaymentIntentPaymentFailed(payload: Stripe.PaymentIntent) {
    const lastError = payload.last_payment_error
    const sessions = await this.stripe.checkout.sessions.list({
      limit: 1,
      payment_intent: payload.id,
    })
    const session = sessions.data[0]
    let paymentMethodType = null
    if (payload.payment_method) {
      const paymentMethod = await this.stripe.paymentMethods.retrieve(
        payload.payment_method as string
      )
      paymentMethodType = paymentMethod.type
    }
    const cartId = Number(session.metadata!.cartId)
    const hasPayment = await Payment.findBy('id', payload.id.toString())
    if (hasPayment) {
      hasPayment.merge({
        status: 'failed',
      })
      await hasPayment.save()
      await PaymentFailure.create({
        paymentId: hasPayment.id,
        stripePaymentIntentId: payload.id,
        failureCode: lastError?.code,
        failureMessage: lastError?.message,
        declineCode: lastError?.decline_code,
        stripeErrorType: lastError?.type,
      })
      return
    } else {
      await Payment.create({
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: payload.id,
        amount: payload.amount,
        currency: payload.currency,
        paymentMethod: paymentMethodType!,
        status: 'failed',
        cartId: cartId,
      })
    }
  }
}
