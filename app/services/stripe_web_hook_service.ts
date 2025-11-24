import env from '#start/env'
import Cart from '#models/cart'
import User from '#models/user'
import Stripe from 'stripe'
import Payment from '#models/payment'
import db from '@adonisjs/lucid/services/db'
import { addMinutes } from 'date-fns'

//exceptions
import { ItemNotFoundException } from '#exceptions/items_exceptions/item_not_found_exception'
import HTTPAlreadyExistsException from '#exceptions/http_exceptions/HTTP_already_exists_exception'
import PaymentFailure from '#models/payment_failure'

const STRIPE_API_SECRET_KEY = env.get('STRIPE_API_SECRET_KEY')!

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

    const dateNow = new Date()

    const futureDate = addMinutes(dateNow, 30)

    let timestampExpireOn = Math.floor(futureDate.getTime() / 1000)

    console.log(timestampExpireOn)

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
    console.log('Checkou completed: ', payload.payment_status)
    const hasLog = await Payment.findBy('id', payload.id)
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
      userId: Number(payload.metadata!.userId),
      status: payload.payment_status && paymentIntent.status,
    }

    if (paymentIntent) {
      checkoutLogObject = {
        id: payload.id,
        amount: paymentIntent.amount!,
        currency: paymentIntent.currency!,
        payment_method: paymentMethodType,
        userId: Number(payload.client_reference_id),
        status: paymentIntent.status!,
      }
    }

    await Payment.create({
      stripeCheckoutSessionId: checkoutLogObject.id,
      amount: checkoutLogObject.amount!,
      currency: checkoutLogObject.currency!,
      paymentMethod: checkoutLogObject.payment_method!,
      userId: checkoutLogObject.userId,
      status: checkoutLogObject.status,
    })
  }

  async handlePaymentIntentSucceeded(payload: Stripe.PaymentIntent) {
    const session = await this.stripe.checkout.sessions.list({
      limit: 1,
      payment_intent: payload.id,
    })

    const sessionId = session.data.map((cs) => {
      return cs.id
    })
    console.log('payment succeeded', payload.status)
    console.log('Session id', sessionId.toString())

    const payment = await Payment.findBy('id', sessionId.toString())

    console.log('Banco de dados', payment)

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
        return
      }
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
        userId: 0,
        status: payload.status,
      }
      session.data.map((cs) => {
        sessionObjectSolved.id = cs.id
        sessionObjectSolved.userId = Number(cs.metadata!.userId.toString())
      })
      await Payment.create({
        stripeCheckoutSessionId: sessionObjectSolved.id,
        amount: sessionObjectSolved.amount,
        currency: sessionObjectSolved.currency,
        paymentMethod: sessionObjectSolved.payment_method,
        status: sessionObjectSolved.status,
        userId: sessionObjectSolved.userId,
      })
      return
    }
    return
  }

  async handlePaymentIntentPaymentFailed(payload: Stripe.PaymentIntent) {
    console.log(payload.status)
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

    const userId = Number(session.metadata!.userId)

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
        userId: userId,
      })
    }
  }

  async getAllPayment(limit: number, page: number) {
    const payments = await db.from('payments').paginate(limit, page)
    return payments
  }

  async deleteAllPayments() {
    const payments = await Payment.findManyBy('userId', 1)

    payments.map(async (payment) => {
      await payment.delete()
    })
  }
}
