import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import { StripeWebHookService } from '#services/stripe_web_hook_service'
import { inject } from '@adonisjs/core'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'
import stripe, { Stripe } from 'stripe'

@inject()
export default class StripeWebHooksController {
  constructor(private stripeWebHookService: StripeWebHookService) {}

  async stripeCheckout({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()

    const stripeResponse = await this.stripeWebHookService.payment(user)

    return response.created(stripeResponse.url!)
  }

  async stripeListener({ request, response }: HttpContext) {
    console.log('Escutei algo')
    const endpointSecret = env.get('STRIPE_WEBHOOK_SECRET')

    let event
    if (endpointSecret) {
      const signature = request.header('stripe-signature')
      const rawBody = request.raw()
      try {
        event = stripe.webhooks.constructEvent(rawBody!, signature!, endpointSecret)
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message)
        return response.badRequest
      }
    }

    console.log('event: ', event?.type)
    switch (event!.type) {
      case 'payment_intent.created':
        const paymentIntentCreated: Stripe.PaymentIntentCreatedEvent = event
        console.log('Payment_Intent created: ', paymentIntentCreated)
        break

      case 'payment_intent.succeeded':
        const paymentIntentSucced: Stripe.PaymentIntentSucceededEvent = event
        console.log(`PaymentIntent for ${paymentIntentSucced} was successful!`)
        break

      case 'payment_intent.payment_failed':
        const paymentIntentPaymentFailed: Stripe.PaymentIntentPaymentFailedEvent = event
        console.log(`PaymentIntent for ${paymentIntentPaymentFailed} was successful!`)
        break

      case 'payment_intent.canceled':
        const paymentIntentCanceled: Stripe.PaymentIntentCanceledEvent = event
        console.log(`Paymente intent canceled event: ${paymentIntentCanceled}`)
        break

      case 'checkout.session.completed':
        const checkoutSessionComplete: Stripe.CheckoutSessionCompletedEvent = event
        console.log(`Checkout session complete event: ${checkoutSessionComplete}`)
        break

      case 'checkout.session.expired':
        const checkoutSessionExpired: Stripe.CheckoutSessionExpiredEvent = event
        console.log(`Checkout session expired: ${checkoutSessionExpired} `)
        break

      default:
        console.log(`Unhandled event type ${event!.type}.`)
        break
    }

    return response.ok({})
  }
}
