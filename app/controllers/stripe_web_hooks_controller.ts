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
        console.log(`Webhook signature verification failed.`, err.message)
        return response.badRequest
      }
    }

    switch (event!.type) {
      case 'checkout.session.completed':
        const paymentEvent: Stripe.CheckoutSessionCompletedEvent = event
        console.log(paymentEvent.request?.idempotency_key)
        await this.stripeWebHookService.handleStripeWebHookGenericEvent(paymentEvent)
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

  async getAllPayments({ response }: HttpContext) {
    const payment: any = await this.stripeWebHookService.getAllPayment(1, 1)
    return response.ok({ payment: payment })
  }
}
