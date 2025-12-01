import env from '#start/env'
import stripe, { Stripe } from 'stripe'
import type { HttpContext } from '@adonisjs/core/http'
import { StripeWebHookService } from '#services/stripe_web_hook_service'
import { inject } from '@adonisjs/core'
import { ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'

@inject()
export default class StripeWebHooksController {
  constructor(private stripeWebHookService: StripeWebHookService) {}

  @ApiOperation({
    description:
      'Cria uma sessão de checkout na plataforma de pagamentos da Stripe, enviando as informações do carrinho do usuário.',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized ',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized access' },
        code: { type: 'string', example: 'E_UNAUTHORIZED' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Items not found ',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Items not found' },
        code: { type: 'string', example: 'E_NOT_FOUND' },
      },
    },
  })
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
        return response.badRequest({ Message: 'Webhook signature verification failed.' })
      }
    }

    switch (event!.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted: Stripe.Checkout.Session = event.data.object
        await this.stripeWebHookService.handleCheckoutSessionCompleteEvent(checkoutSessionCompleted)
        console.log('Webhook: ', event.type)
        break

      case 'checkout.session.expired':
        // const checkoutSessionExpired: Stripe.Checkout.Session = event.data.object
        console.log('Webhook: ', event.type)
        break
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded: Stripe.PaymentIntent = event.data.object
        await this.stripeWebHookService.handlePaymentIntentSucceeded(paymentIntentSucceeded)
        console.log('Webhook: ', event.type)
        break
      case 'payment_intent.canceled':
      case 'payment_intent.payment_failed':
        const paymentIntentPaymentFailed: Stripe.PaymentIntent = event.data.object
        await this.stripeWebHookService.handlePaymentIntentPaymentFailed(paymentIntentPaymentFailed)
        console.log('Webhook: ', event.type)
        break

      default:
        console.log(`Unhandled event type ${event!.type}.`)
        break
    }

    return response.ok({})
  }
}
