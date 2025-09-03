import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class NotFoundException extends Exception {
  static status = 404
  static code = 'E_NOT_FOUND'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      Error: {
        status: error.status,
        message: error.message,
      },
    })
  }
}
