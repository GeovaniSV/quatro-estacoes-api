import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'

export default class AdminOnlyMiddleware {
  async handle({ auth }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const user = auth.user

    if (!user) throw new UnauthorizedException()

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException()
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
