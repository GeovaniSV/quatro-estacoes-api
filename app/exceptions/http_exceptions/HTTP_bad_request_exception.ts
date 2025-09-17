import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class HTTPBadRequestException extends Exception {
  static status = 400
  static code = 'E_BAD_REQUEST'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      Error: {
        status: error.status,
        message: error.message,
      },
    })
  }
}
