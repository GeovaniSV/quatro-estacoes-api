import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class HTTPAlreadyExistsException extends Exception {
  static status = 409
  static code = 'E_ALREADY_EXISTS'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      Error: {
        status: error.status,
        message: error.message,
      },
    })
  }
}
