import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

//exceptions
import HTTPUnauthorized from '#exceptions/http_exceptions/HTTP_unauthorized_exceptions'

export default class AdminOnlyMiddleware {
  async handle({ auth }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const user = auth.user

    if (!user) throw new HTTPUnauthorized('Unauthorized access')

    if (user.role !== 'ADMIN') {
      throw new HTTPUnauthorized('Unauthorized access')
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
